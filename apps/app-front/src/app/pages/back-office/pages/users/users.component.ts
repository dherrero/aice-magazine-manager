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
        title: 'Error',
        message: error,
        confirmText: 'Aceptar',
        cancelText: 'Cancelar',
      })
      .subscribe();
  }

  getPermissionLabel(permission: string): string {
    const permissionMap: Record<string, string> = {
      ADMIN: 'Administrador',
      SEARCH_MAGAZINE: 'Buscar revistas',
      EDIT_MAGAZINE: 'Editar revistas',
    };
    return permissionMap[permission] || permission;
  }

  confirmDelete(user: UserDTO) {
    this.#confirmService
      .open({
        title: 'Eliminar usuario',
        message: `¿Estás seguro de que deseas eliminar al usuario ${user.name} ${user.lastName}?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
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
          'Error al eliminar el usuario';
        this.#confirmService
          .open({
            title: 'Error',
            message: errorMessage,
            confirmText: 'Aceptar',
            cancelText: undefined,
          })
          .subscribe();
      },
    });
  }
}
