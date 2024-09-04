import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  // Map 'confirm' to 'question' for SweetAlert2 compatibility
  showAlert(type: 'success' | 'error' | 'warning' | 'info' | 'confirm' |'question', title: string, message: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
      customClass: {
        popup: 'custom-swal-popup',
        title: 'custom-swal-title',
        icon: 'custom-swal-icon',
        timerProgressBar: 'custom-swal-progress-bar',
        closeButton: 'custom-swal-close'
      }
    });

    const iconType = type === 'confirm' ? 'question' : type;

    Toast.fire({
      icon: iconType,
      title: title,
      text: message
    });
  }
  clearAlert() {
    Swal.close();
  }
}
