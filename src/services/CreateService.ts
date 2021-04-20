export class CreateService {
    private constructor() { }

    private static _parentId: string;

    public static get parentId() {
        return CreateService._parentId;
    }
    public static set parentId(_parentId: string) {
        CreateService._parentId = _parentId;
    }
}