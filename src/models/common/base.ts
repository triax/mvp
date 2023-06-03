import { initializeApp } from "firebase/app";
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, onSnapshot, updateDoc } from "firebase/firestore";
import Errors from "./errors";

const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG_JSONSTR);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

type ModelConstructor<T> = {
    get<T>(id: string): Promise<T|null>;
    new(props?: any): T;
}

export class Base {
    static path: string;
    id?: string;
    constructor(id?: string) {
        this.id = id;
    }
    encode(): Record<string, any> {
        throw Error("`encode` method must be implemented by subclass");
    }
    validate(): Errors | null {
        throw Error("`validate` method must be implemented by subclass");
    }
    async upsert<T extends Base>(this: T, path = (<any>this).constructor.path): Promise<T> {
        if (this.id) {
            const ref = doc(db, path, this.id);
            await updateDoc(ref, this.encode());
            return this;
        } else {
            const col = collection(db, path);
            const ref = await addDoc(col, this.encode());
            this.id = ref.id;
            return this;
        }
    }

    static async get<T>(this: ModelConstructor<T>, id: string): /* Promise<T> */ Promise<T|null> {
        const path = (<any>this).path;
        const ref = doc(db, path, id);
        const snapshot = await getDoc(ref);
        return new this({
            id: snapshot.id,
            ...snapshot.data(),
        });
    }

    static async list<T>(this: ModelConstructor<T>, path: string = (<any>this).path): Promise<T[]> {
        const ref = collection(db, path);
        const snapshot = await getDocs(ref)
        return snapshot.docs.map(doc => new this({
            id: doc.id,
            ...doc.data(),
        }));
    }

    static onUpdate<T>(this: ModelConstructor<T>, cb: (docs: T[]) => void, path: string = (<any>this).path): void {
        const ref = collection(db, path);
        onSnapshot(ref, (snapshot) => {
            const docs: T[] = [];
            snapshot.forEach((doc) => docs.push(new this({ ...doc.data(), id: doc.id })));
            cb(docs);
        });
    }
}