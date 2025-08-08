import { CommonModule } from '@angular/common';
import { Component, TemplateRef, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserDTO } from '@dto';
import { ConfirmModule } from '@front/app/components/confirm/confirm.module';
import { ConfirmService } from '@front/app/components/confirm/confirm.service';
import { UserFormComponent } from '@front/app/components/user-form/user-form.component';
import { UserService } from '@front/app/services/user.service';
import {
  NgbModal,
  NgbModalRef,
  NgbPaginationModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable, map, switchMap } from 'rxjs';

interface StatusListView {
  page: number;
  pageSize: number;
  loading: boolean;
  search?: string;
}

@UntilDestroy()
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    UserFormComponent,
    ConfirmModule,
    FormsModule,
    NgbTooltipModule,
    NgbPaginationModule,
    TranslocoModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export default class UsersComponent {
  collectionSize = 0;

  get page() {
    return this.#userViewStatus.value.page;
  }
  set page(page: number) {
    this.#userViewStatus.next({ ...this.#userViewStatus.value, page });
  }

  get pageSize() {
    return this.#userViewStatus.value.pageSize;
  }
  set pageSize(pageSize: number) {
    this.#userViewStatus.next({
      ...this.#userViewStatus.value,
      pageSize,
    });
  }

  #modalService = inject(NgbModal);
  #userService = inject(UserService);
  #translocoService = inject(TranslocoService);
  #userViewStatus = new BehaviorSubject<StatusListView>({
    page: 1,
    pageSize: 5,
    loading: false,
  });
  #userViewStatus$ = this.#userViewStatus.asObservable();
  users$: Observable<UserDTO[]> = this.#userViewStatus$.pipe(
    untilDestroyed(this),
    switchMap((status) =>
      this.#userService.listUsers(status.page, status.pageSize).pipe(
        map((res) => {
          this.collectionSize = res.count;
          return res.rows;
        })
      )
    )
  );
  #ngbModalRef: NgbModalRef | undefined;
  #confirmService = inject(ConfirmService);

  open(content: TemplateRef<unknown>) {
    this.#ngbModalRef = this.#modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
  }

  openCreateUser() {
    this.#ngbModalRef = this.#modalService.open(UserFormComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });

    // Configurar los eventos del formulario
    this.#ngbModalRef.componentInstance.afterSave.subscribe(() => {
      this.onUserSave();
    });

    this.#ngbModalRef.componentInstance.afterError.subscribe(
      (error: string) => {
        this.onUserError(error);
      }
    );
  }

  openEditUser(user: UserDTO) {
    this.#ngbModalRef = this.#modalService.open(UserFormComponent, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'lg',
    });
    this.#ngbModalRef.componentInstance.user = user;

    // Configurar los eventos del formulario
    this.#ngbModalRef.componentInstance.afterSave.subscribe(() => {
      this.onUserSave();
    });

    this.#ngbModalRef.componentInstance.afterError.subscribe(
      (error: string) => {
        this.onUserError(error);
      }
    );
  }

  onUserSave() {
    this.#ngbModalRef?.close();
    this.page = 1;
  }

  onUserError(error: string) {
    console.error('Error:', error);
    // Mostrar mensaje de error al usuario
    this.#confirmService
      .open({
        title: this.#translocoService.translate('common.error'),
        message: error,
        confirmText: this.#translocoService.translate('common.ok'),
        cancelText: this.#translocoService.translate('common.cancel'),
      })
      .subscribe();
  }

  getPermissionLabel(permission: string): string {
    const permissionMap: Record<string, string> = {
      ADMIN: this.#translocoService.translate('permissions.admin'),
      SEARCH_MAGAZINE: this.#translocoService.translate(
        'permissions.searchMagazine'
      ),
      EDIT_MAGAZINE: this.#translocoService.translate(
        'permissions.editMagazine'
      ),
    };
    return permissionMap[permission] || permission;
  }

  confirmDelete(user: UserDTO) {
    this.#confirmService
      .open({
        title: this.#translocoService.translate('user.deleteUser'),
        message: this.#translocoService.translate('user.deleteUserConfirm'),
        confirmText: this.#translocoService.translate('common.delete'),
        cancelText: this.#translocoService.translate('common.cancel'),
      })
      .subscribe((confirm) => {
        if (confirm) {
          this.deleteUser(user.id);
        }
      });
  }

  private deleteUser(userId: number) {
    this.#userService.deleteUser(userId).subscribe({
      next: () => {
        this.page = 1;
      },
      error: (error) => {
        console.error('Error deleting user:', error);
        // Mostrar mensaje de error al usuario
        const errorMessage =
          error.error?.message ||
          error.message ||
          this.#translocoService.translate('user.deleteUserError');
        this.#confirmService
          .open({
            title: this.#translocoService.translate('common.error'),
            message: errorMessage,
            confirmText: this.#translocoService.translate('common.ok'),
            cancelText: undefined,
          })
          .subscribe();
      },
    });
  }
}
