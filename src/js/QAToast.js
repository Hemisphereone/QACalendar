import * as bootstrap from 'bootstrap'

export default class QAToast 
{
    constructor ( ) {
        this.toast = null;
    }


    createToast(message, title, delay = 2000) 
    {
        const toastContainer = document.getElementById('toast-container');

        const toastElement = document.createElement('div');
        toastElement.classList.add('toast', 'fade');
        toastElement.setAttribute('role', 'alert');
        toastElement.setAttribute('aria-live', 'assertive');
        toastElement.setAttribute('aria-atomic', 'true');

        const toastHeader = document.createElement('div');
        toastHeader.classList.add('toast-header');
        toastHeader.innerHTML = `
            <strong class="me-auto">${title}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        `;

        const toastBody = document.createElement('div');
        toastBody.classList.add('toast-body');
        toastBody.textContent = message;

        toastElement.appendChild(toastHeader);
        toastElement.appendChild(toastBody);
        toastContainer.appendChild(toastElement);

        const toast = new bootstrap.Toast(toastElement, { "delay": delay });
        toast.show();

        toastElement.addEventListener('hidden.bs.toast', function () {
            toastElement.remove();
        });

        return toast
    }
}