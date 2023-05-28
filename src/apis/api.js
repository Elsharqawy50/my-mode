import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const fetchCollagesTable = () => {
  return getDocs(collection(db, "collages")).then((res) => {
    const array = [];
    res.forEach((doc) => {
      array.push({ id: doc.id, ...doc.data() });
    });
    return array[0].data;
  });
};

export const editAllCollages = (body) => {
  return setDoc(doc(db, "collages", "data"), {
    data: body,
  });
};

export const fetchDate = () => {
  return getDocs(collection(db, "restTime")).then((res) => {
    const array = [];
    res.forEach((doc) => {
      array.push({ id: doc.id, ...doc.data() });
    });
    return array[0].data;
  });
};

export const editDate = (body) => {
  return setDoc(doc(db, "restTime", "data"), { data: body });
};