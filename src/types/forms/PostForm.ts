export type PostFormType = {
    content: string,
    image: File | null,
}

export const DEFAULT_POST_FORM: PostFormType = {
    content: "",
    image: null,
}