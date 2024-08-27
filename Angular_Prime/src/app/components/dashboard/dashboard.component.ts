import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Table } from 'primeng/table';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, PieController, ArcElement, RadialLinearScale } from 'chart.js';
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, PieController, ArcElement, RadialLinearScale);

interface Alert {
  type: 'success' | 'error' | 'warning' | 'info' | 'confirm';
  title: string;
  message: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  alert: Alert | null = null;

  constructor(private router: Router, private alertService: AlertService) {
    this.alertService.alert$.subscribe(alert => {
      this.alert = alert;
    });
  }

  @ViewChild('dt') dt: Table | undefined;

  annoData: any[] = [
    { title: 'Announcement 1', announcerName: 'John Doe', duration: '3 days', progress: 70 },
    { title: 'Announcement 2', announcerName: 'Jane Smith', duration: '5 days', progress: 45 },
    { title: 'Announcement 3', announcerName: 'Jane Smith', duration: '4 days', progress: 95 }
  ];

  ngAfterViewInit(): void {
    this.loadChart(); // Load chart after the view has been initialized
  }

  onFilter(event: Event, field: string) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.dt?.filter(value, field, 'contains');
  }

  fails() {
    this.alertService.showAlert('error', 'Login Failed', 'Invalid username or password.');
  }

  loadChart(): void {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      // Bar Chart Initialization (same as before)
      const barCanvas = document.getElementById('barChart') as HTMLCanvasElement | null;
      if (barCanvas) {
        new Chart(barCanvas, {
          type: 'bar',
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [{
              label: 'Sales',
              data: [65, 59, 80, 81, 56, 55],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
  
      const pieCanvas = document.getElementById('pieChart') as HTMLCanvasElement | null;
      if (pieCanvas) {
        new Chart(pieCanvas, {
          type: 'pie',
          data: {
            labels: ['Announce 1', 'Announce 2', 'Announce 3'], // Custom labels for each slice
            datasets: [{
              data: [300, 50, 100],
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)', // Red for Announce 1
                'rgba(54, 162, 235, 0.6)', // Blue for Announce 2
                'rgba(255, 206, 86, 0.6)'  // Yellow for Announce 3
              ],
              hoverBackgroundColor: [
                'rgba(255, 99, 132, 1)',   // Red hover
                'rgba(54, 162, 235, 1)',   // Blue hover
                'rgba(255, 206, 86, 1)'    // Yellow hover
              ]
            }]
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
                position: 'right', // Position legend to the right of the chart
                labels: {
                  boxWidth: 20, // Size of the color box in the legend
                  padding: 15,  // Padding between the labels
                  color: 'black', // Legend text color
                  font: {
                    size: 14 // Font size of the labels
                  }
                }
              },
              tooltip: {
                enabled: true // Tooltips for each slice
              }
            }
          }
        });
      }
    }
  }
  
  
  
}
