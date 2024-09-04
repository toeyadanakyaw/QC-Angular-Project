import { Component, AfterViewInit, OnInit } from '@angular/core';
import { RequestAnnounceService } from '../../services/request-announce.service';
import { RequestAnnounce, Status } from '../../models/requestAnnounce'; // Ensure the correct path
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2'; // Import SweetAlert2
declare var bootstrap: any;

@Component({
  selector: 'app-request-announce',
  templateUrl: './request-announce.component.html',
  styleUrls: ['./request-announce.component.css']
})
export class RequestAnnounceComponent implements AfterViewInit {
  public announcements: RequestAnnounce[] = [];
  public selectedAnnouncement: RequestAnnounce | null = null;
  public Status = Status;  // Expose the Status enum to the template
  sanitizer: any;
  defaultStatus: 3 | undefined;
  
  constructor(private requestAnnounceService: RequestAnnounceService) { }

  ngOnInit(): void {
    this.loadAnnouncements();
  }
  
  getCloudinaryUrl(publicId: string | undefined, resourceType: string): SafeResourceUrl {
    if (!publicId) {
      return '';  // Or handle this case appropriately
    }
    const baseUrl = `https://res.cloudinary.com/your-cloud-name/${resourceType}/upload/`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(`${baseUrl}${publicId}`);
  }

  isImage(fileExtension: string): boolean {
    return ['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension.toLowerCase());
  }
  
  isExcel(fileExtension: string): boolean {
    return ['xls', 'xlsx'].includes(fileExtension.toLowerCase());
  }

  // Function to check if the file is viewable (image or pdf)
  isViewableFile(fileExtension: string): boolean {
    return this.isImage(fileExtension) || fileExtension === 'pdf';
  }

  loadAnnouncements(): void {
    this.requestAnnounceService.findall().subscribe(
      (data: RequestAnnounce[]) => {
        this.announcements = data.map(announce => {
          let statusNumber: Status;
  
          if (typeof announce.status === 'string') {
            switch (announce.status) {
              case 'SOFT_DELETE':
                statusNumber = Status.SOFT_DELETE;
                break;
              case 'APPROVE':
                statusNumber = Status.APPROVE;
                break;
              case 'DECLINE':
                statusNumber = Status.DECLINE;
                break;
              case 'PENDING':
                statusNumber = Status.PENDING;
                break;
              default:
                statusNumber = Status.PENDING;
                break;
            }
          } else if (typeof announce.status === 'number') {
            statusNumber = [Status.SOFT_DELETE, Status.APPROVE, Status.DECLINE, Status.PENDING].includes(announce.status)
              ? announce.status
              : Status.PENDING;
          } else {
            statusNumber = Status.PENDING;
          }
  
          announce.status = statusNumber;
          return announce;
        });
      },
      (error: any) => {
        console.error('Error fetching announcements', error);
      }
    );
  }
  
  openModal(announce: RequestAnnounce): void {
    this.selectedAnnouncement = announce;
    const modal = new bootstrap.Modal(document.getElementById('detailsModal'));
    modal.show();
  }

  approveAnnouncement(announce: RequestAnnounce, event: Event): void {
    event.stopPropagation();
    
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to approve this announcement!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, approve it!"
    }).then((result) => {
      if (result.isConfirmed) {
        announce.status = Status.APPROVE;
        this.updateAnnouncementStatus(announce.id, Status.APPROVE);
        Swal.fire("Approved!", "The announcement has been approved.", "success");
      }
    });
  }

  declineAnnouncement(announce: RequestAnnounce, event: Event): void {
    event.stopPropagation();
    
    Swal.fire({
      title: "Are you sure?",
      text: "You are about to decline this announcement!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, decline it!"
    }).then((result) => {
      if (result.isConfirmed) {
        announce.status = Status.DECLINE;
        this.updateAnnouncementStatus(announce.id, Status.DECLINE);
        Swal.fire("Declined!", "The announcement has been declined.", "success");
      }
    });
  }

  reloadToPending(announce: RequestAnnounce, event: Event): void {
    announce.status = Status.PENDING;
    event.stopPropagation();
    this.updateAnnouncementStatus(announce.id, Status.PENDING);
  }

  deleteAnnouncement(announce: RequestAnnounce, event: Event): void {
    event.stopPropagation();
    
    Swal.fire({
      title: "Are you sure?",
      text: "This announcement will be deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.announcements = this.announcements.filter(a => a !== announce);
        this.updateAnnouncementStatus(announce.id, Status.SOFT_DELETE);
        Swal.fire("Deleted!", "The announcement has been deleted.", "success");
      }
    });
  }

  updateAnnouncementStatus(id: number, status: Status): void {
    this.requestAnnounceService.updateStatus(id, status).subscribe({
      next: (response) => {
        this.loadAnnouncements();  
        console.log("Update successful:", response);
      },
      error: (error) => {
        console.error("Error during update:", error);
      }
    });
  }

  ngAfterViewInit(): void {
    const detailsModal = document.getElementById('detailsModal');

    if (detailsModal) {
      detailsModal.addEventListener('show.bs.modal', (event: any) => {
        const button = event.relatedTarget as HTMLElement;

        if (button) {
          const title = button.getAttribute('data-title');
          const content = button.getAttribute('data-content');
          const documents = button.getAttribute('data-documents');
          const announcer = button.getAttribute('data-announcer');
          const date = button.getAttribute('data-date');

          const modalTitle = detailsModal.querySelector('.modal-title');
          const modalContent = detailsModal.querySelector('#modalContent');
          const modalDocuments = detailsModal.querySelector('#modalDocuments');
          const modalAnnouncer = detailsModal.querySelector('#modalAnnouncer');
          const modalDate = detailsModal.querySelector('#modalDate');

          if (modalTitle) modalTitle.textContent = title;
          if (modalContent) modalContent.textContent = content;
          if (modalDocuments) modalDocuments.textContent = documents;
          if (modalAnnouncer) modalAnnouncer.textContent = announcer;
          if (modalDate) modalDate.textContent = date;
        }
      });
    }
  }
}
