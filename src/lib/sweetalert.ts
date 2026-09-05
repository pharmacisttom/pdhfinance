import Swal, { SweetAlertIcon, SweetAlertOptions } from 'sweetalert2';

/**
 * Custom Styled SweetAlert2 instance for Finance Control Platform
 * Designed with hospital executive theme (Navy Blue, Emerald, Rounded Modern UI)
 */
export const customSwal = Swal.mixin({
  customClass: {
    popup: 'rounded-2xl shadow-2xl border border-gray-100 p-6 font-sans',
    title: 'text-lg font-bold text-[#08294F]',
    htmlContainer: 'text-xs text-gray-600 leading-relaxed',
    confirmButton: 'px-5 py-2.5 rounded-xl font-bold text-xs bg-[#08294F] text-white hover:bg-[#0D3768] shadow-md transition-all mx-1.5 focus:outline-hidden',
    cancelButton: 'px-5 py-2.5 rounded-xl font-bold text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all mx-1.5 focus:outline-hidden',
    denyButton: 'px-5 py-2.5 rounded-xl font-bold text-xs bg-rose-600 text-white hover:bg-rose-700 shadow-md transition-all mx-1.5 focus:outline-hidden',
  },
  buttonsStyling: false,
});

/**
 * Toast Notification (Top Right)
 */
export const toastSwal = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3500,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
  customClass: {
    popup: 'rounded-xl shadow-lg border border-gray-100 text-xs font-semibold p-3',
  },
});

/**
 * Alert Success
 */
export const alertSuccess = (title: string, text?: string) => {
  return customSwal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'ตกลง',
  });
};

/**
 * Alert Error
 */
export const alertError = (title: string, text?: string) => {
  return customSwal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'รับทราบ',
  });
};

/**
 * Alert Warning
 */
export const alertWarning = (title: string, text?: string) => {
  return customSwal.fire({
    icon: 'warning',
    title,
    text,
    confirmButtonText: 'เข้าใจแล้ว',
  });
};

/**
 * Alert Info
 */
export const alertInfo = (title: string, text?: string) => {
  return customSwal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonText: 'ตกลง',
  });
};

/**
 * Confirmation Dialog (Returns true if confirmed)
 */
export const confirmAction = async (options: {
  title: string;
  text?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  icon?: SweetAlertIcon;
}): Promise<boolean> => {
  const result = await customSwal.fire({
    icon: options.icon || 'warning',
    title: options.title,
    text: options.text,
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || 'ยืนยันดำเนินการ',
    cancelButtonText: options.cancelButtonText || 'ยกเลิก',
    reverseButtons: true,
  });

  return result.isConfirmed;
};

/**
 * Quick Toast
 */
export const showToast = (title: string, icon: SweetAlertIcon = 'success') => {
  toastSwal.fire({
    icon,
    title,
  });
};

/**
 * Loading Spinner
 */
export const showLoading = (title: string = 'กำลังประมวลผล...', text: string = 'กรุณารอสักครู่') => {
  customSwal.fire({
    title,
    text,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const closeLoading = () => {
  Swal.close();
};

export default Swal;
