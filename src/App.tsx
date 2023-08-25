import { useCallback } from "react";

import { User as FirebaseUser } from "firebase/auth";
import {
  Authenticator,
  buildCollection,
  buildEntityCallbacks,
  FirebaseCMSApp,
} from "firecms";
import "typeface-rubik";
import "@fontsource/ibm-plex-mono";
import { categories } from "./enums";

// TODO: Replace with your config
const firebaseConfig = {
  apiKey: "AIzaSyC_hn6xbenSm3PDFwksFK8EMANg-nhvGQI",
  authDomain: "librarysystem-ba088.firebaseapp.com",
  projectId: "librarysystem-ba088",
  storageBucket: "librarysystem-ba088.appspot.com",
  messagingSenderId: "804159856539",
  appId: "1:804159856539:web:2df2cafcb05ddb69d94b3e",
};
//i wan to have the id of the user as the id of the book

type Book = {
  //use nano id

  //use nano id

  title: string;
  price: number;

  description: string;
  author: string;
  category: string;
  imageUrl: string;
  copies: number;
  pages: number;
  publisher: string;
  publicationDate: Date;
  ISBN: number;
  // genre: string;
};
const bookCallbacks = buildEntityCallbacks({
  onPreSave: ({ entityId, values }) => {
    // Set the 'id' property to the document ID using nanoid()
    values.id = entityId;
    return values;
  },
});

const booksCollection = buildCollection<Book>({
  name: "Books",
  singularName: "Book",
  path: "books",
  permissions: ({}) => ({
    read: true,
    edit: true,
    create: true,
    delete: true,
  }),

  properties: {
    author: {
      name: "Author",
      dataType: "string",
      validation: { required: true },
    },

    title: {
      name: "Title",
      dataType: "string",
      validation: { required: true },
    },
    price: {
      name: "Price",
      dataType: "number",
      validation: { required: true },
    },
    description: {
      name: "Description",
      dataType: "string",
      validation: { required: true },
    },
    imageUrl: {
      name: "Book image",
      dataType: "string",
      storage: {
        storagePath: "books",
        storeUrl: true,
      },
    },
    category: {
      name: "Category",
      dataType: "string",
      enumValues: categories,
      validation: { required: true },
    },
    copies: {
      name: "Copies",

      dataType: "number",
      validation: { required: true },
    },
    pages: {
      name: "Pages",

      dataType: "number",

      validation: { required: true },
    },
    publisher: {
      name: "Publisher",

      dataType: "string",

      validation: { required: true },
    },
    publicationDate: {
      name: "Publication Date",
      dataType: "date",

      validation: { required: true },
    },
    ISBN: {
      name: "ISBN",
      dataType: "number",
      validation: { required: true },
    },
  },

  callbacks: bookCallbacks,
});

type BorrowedBook = {
  title: string;
  ISBN: number;
  category: string;
  imageUrl: string;
  fullName: string;
  email: string;
  borrowedDate: Date;
  returnDate: Date;
  address: string;
  author: string;
};

const borrrowedBooksCollection = buildCollection<BorrowedBook>({
  name: "Borrowed Books",
  singularName: "Borrowed Book",
  path: "borrowedBooks",

  permissions: ({}) => ({
    read: true,
    edit: true,
    create: true,
    delete: true,
  }),

  properties: {
    imageUrl: {
      name: "Book image",
      dataType: "string",
      storage: {
        storagePath: "books",
        storeUrl: true,
      },
    },

    author: {
      name: "Author",
      dataType: "string",
      validation: { required: true },
    },

    fullName: {
      name: "Full Name",
      dataType: "string",
      validation: { required: true },
    },
    address: {
      name: "Address",
      dataType: "string",
      validation: { required: true },
    },

    email: {
      name: "Email",
      dataType: "string",
      validation: { required: true },
    },

    title: {
      name: "Title",

      dataType: "string",
      validation: { required: true },
    },
    ISBN: {
      name: "ISBN",

      dataType: "number",
      validation: { required: true },
    },

    category: {
      name: "Category",
      dataType: "string",
      enumValues: categories,
      validation: { required: true },
    },
    borrowedDate: {
      name: "Borrowed Date",
      dataType: "date",
      validation: { required: true },
    },
    returnDate: {
      name: "Return Date",
      dataType: "date",
      validation: { required: true },
    },
  },
});

type User = {
  name: string;
  email: string;
  phone: string;
  //address: string;
};

const usersCollection = buildCollection<User>({
  name: "users",
  singularName: "Patron",
  path: "users",
  permissions: ({}) => ({
    read: true,
    edit: true,
    create: true,
    delete: true,
  }),

  properties: {
    name: {
      name: "Name",
      dataType: "string",
      validation: { required: true },
    },
    email: {
      name: "Email",
      dataType: "string",
      validation: { required: true },
    },
    phone: {
      name: "Phone",
      dataType: "string",

      validation: { required: true },
    },
    // address: {
    //   name: "Address",
    //   dataType: "string",
    //   validation: { required: true },
    // },
  },
});

export default function App() {
  const myAuthenticator: Authenticator<FirebaseUser> = useCallback(
    async ({ user, authController }) => {
      if (user?.email?.includes("flanders")) {
        throw Error("Stupid Flanders!");
      }

      console.log("Allowing access to", user?.email);
      // This is an example of retrieving async data related to the user
      // and storing it in the controller's extra field.
      const sampleUserRoles = await Promise.resolve(["admin"]);
      authController.setExtra(sampleUserRoles);

      return true;
    },
    []
  );

  return (
    <FirebaseCMSApp
      name={"Library Management admin"}
      authentication={myAuthenticator}
      collections={[booksCollection, borrrowedBooksCollection, usersCollection]}
      firebaseConfig={firebaseConfig}
    />
  );
}
