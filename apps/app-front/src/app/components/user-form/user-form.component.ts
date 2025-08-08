import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserDTO } from '@dto';
import { UserService } from '@front/app/services/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { finalize } from 'rxjs';

export interface UserFormData {
  id?: number;
  email: string;
  name: string;
  lastName: string;
  permission: string;
  password?: string;
}

@UntilDestroy()
@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  @Input() user?: UserDTO;
  @Output() afterSave = new EventEmitter<void>();
  @Output() afterError = new EventEmitter<string>();

  form: FormGroup;
  loading = false;
  isEditMode = false;

  #fb = inject(FormBuilder);
  #userService = inject(UserService);
  #activeModal = inject(NgbActiveModal);

  constructor() {
    this.form = this.#fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      permission: ['', Validators.required],
      password: [''],
    });
  }

  ngOnInit() {
    if (this.user) {
      this.isEditMode = true;
      this.form.patchValue({
        email: this.user.email,
        name: this.user.name,
        lastName: this.user.lastName,
        permission: this.user.permission,
      });
      // En modo edición, la contraseña es opcional
      this.form.get('password')?.clearValidators();
    } else {
      // En modo creación, la contraseña es requerida
      this.form
        .get('password')
        ?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.form.get('password')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      const formData: UserFormData = this.form.value;

      const request =
        this.isEditMode && this.user
          ? this.#userService.updateUser(this.user.id, formData)
          : this.#userService.createUser(formData);

      request
        .pipe(
          untilDestroyed(this),
          finalize(() => (this.loading = false))
        )
        .subscribe({
          next: () => {
            this.afterSave.emit();
            this.#activeModal.close();
          },
          error: (error) => {
            console.error('Error saving user:', error);
            this.afterError.emit(
              error.message || 'Error al guardar el usuario'
            );
          },
        });
    }
  }

  close() {
    this.#activeModal.dismiss();
  }

  getPermissionOptions() {
    return [
      { value: 'ADMIN', label: 'Administrador' },
      { value: 'SEARCH_MAGAZINE', label: 'Buscar revistas' },
      { value: 'EDIT_MAGAZINE', label: 'Editar revistas' },
    ];
  }
}
