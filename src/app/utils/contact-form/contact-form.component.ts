import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailService } from '../../services/email/email.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
    selector: 'app-contact',
    standalone: true,
    imports: [
        FormsModule,
        CommonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,],
    templateUrl: './contact-form.component.html',
    styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent {
    title: string = '';
    message: string = '';
    successMessage: string | null = null;
    errorMessage: string | null = null;

    constructor(private emailService: EmailService) {}

    onSubmit() {
        const emailData = {
            to: 'test@test.com',
            subject: this.title,
            body: this.message
        };

        this.emailService.sendEmail(emailData).subscribe(
            response => {
                this.successMessage = 'Email sent successfully!';
                this.errorMessage = null;
                this.title = '';
                this.message = '';
            },
            error => {
                this.errorMessage = 'Failed to send email.';
                this.successMessage = null;
            }
        );
    }
}