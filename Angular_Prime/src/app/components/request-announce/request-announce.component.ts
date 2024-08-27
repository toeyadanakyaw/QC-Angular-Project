import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-request-announce',
  templateUrl: './request-announce.component.html',
  styleUrls: ['./request-announce.component.css']
})
export class RequestAnnounceComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    const detailsModal = document.getElementById('detailsModal');

    if (detailsModal) {
      detailsModal.addEventListener('show.bs.modal', (event: any) => {  // Changed Event to any
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
