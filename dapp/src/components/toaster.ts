import toast from 'react-hot-toast';

export const infoToast = (text: string) => toast(text);
export const successToast = (text: string) => toast.success(text);
export const errorToast = (text: string) => toast.error(text);
export const promiseToast = (p: any, loading: string, success?: string, error?: string) =>
    toast.promise(p, { loading, success: success ?? null, error: error ?? null });
