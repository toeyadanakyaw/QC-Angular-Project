import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-user-create-admin',
  templateUrl: './user-create-admin.component.html',
  styleUrl: './user-create-admin.component.css'
})
export class UserCreateAdmin implements OnInit {
  formGroup!: FormGroup;

  ngOnInit() {
      this.formGroup = new FormGroup({
          name: new FormControl(''),
          email: new FormControl(''),
          position1: new FormControl(false),
          position2: new FormControl(false),
          position3: new FormControl(false),
          company1: new FormControl(false),
          company2: new FormControl(false),
          department1: new FormControl(false),
          department2: new FormControl(false),
          role1: new FormControl(false),
          role2: new FormControl(false),
      });
  }

  onSubmit() {
      console.log(this.formGroup.value);
  }
}