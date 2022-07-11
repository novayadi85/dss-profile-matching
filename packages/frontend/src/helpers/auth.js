import { persistName } from '@store/store';

export const getToken = () => {
    const storageName = `persist:${persistName}`
    const storageRaw = localStorage.getItem(storageName)
    const { auth } = JSON.parse(storageRaw)
    const authJson = JSON.parse(auth)
    return authJson?.token ?? ""
}