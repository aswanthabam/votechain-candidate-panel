import React, { useEffect, useState } from "react";
import { Education } from "../../utils/types";
import { useDialog } from "../../hooks/useDialog";
import { useSystemSettings } from "../../hooks/useSystemSettings";
import axios from "axios";

interface EditAboutProps {
  hideDialog: () => void;
}
export const EditAbout: React.FC<EditAboutProps> = ({ hideDialog }) => {
  const [about, setAbout] = useState<string | null>(null);
  const { systemSettings } = useSystemSettings();

  return (
    <div>
      <h1 className="text-3xl font-bold underline underline-offset-8">
        Edit Your About
      </h1>
      <div className="flex flex-col">
        <label className="form-control mt-10">
          <textarea
            required
            className="textarea textarea-bordered h-24"
            placeholder="Write your about here ...."
            onChange={(e) => {
              setAbout(e.target.value);
            }}
          ></textarea>
        </label>
      </div>
      <div className="flex justify-end mt-5">
        <button
          className="btn btn-neutral mr-2"
          onClick={() => {
            console.log("About", about);
            axios
              .put(
                `${
                  systemSettings?.localServer
                }/api/candidate/profile/?ACCESS_KEY=${localStorage.getItem(
                  "access_key"
                )}`,
                { about: about }
              )
              .then((res) => {
                console.log(res);
                hideDialog();
              });
          }}
        >
          Save
        </button>
        <button
          className="btn btn-neutral"
          onClick={() => {
            console.log("Closing dialog");
            hideDialog();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
interface AddEducationProps {
  hideDialog: () => void;
}
export const AddEducation: React.FC<AddEducationProps> = ({ hideDialog }) => {
  const [title, setTitle] = useState("");
  const [fromWhere, setFromWhere] = useState("");
  const [description, setDescription] = useState("");
  const { systemSettings } = useSystemSettings();
  return (
    <div>
      <h1 className="text-3xl font-bold underline underline-offset-8">
        Add an education
      </h1>
      <div className="flex flex-col">
        <label className="form-control mt-5">
          <input
            required
            className="textarea textarea-bordered"
            placeholder="What did you study?"
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="form-control mt-5">
          <input
            required
            className="textarea textarea-bordered"
            placeholder="Where did you study?"
            onChange={(e) => setFromWhere(e.target.value)}
          />
        </label>
        <label className="form-control mt-5">
          <textarea
            required
            className="textarea textarea-bordered h-24"
            placeholder="Give a small description about that education"
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>
      <div className="flex justify-end mt-5">
        <button
          className="btn btn-neutral mr-2"
          onClick={() => {
            var education = {
              title: title,
              fromWhere: fromWhere,
              description: description,
            };
            console.log("Education", education);
            axios
              .post(
                `${
                  systemSettings?.localServer
                }/api/candidate/education/add/?ACCESS_KEY=${localStorage.getItem(
                  "access_key"
                )}`,
                education
              )
              .then((res) => {
                console.log(res);
                hideDialog();
              });
          }}
        >
          Save
        </button>
        <button
          className="btn btn-neutral"
          onClick={() => {
            console.log("Closing dialog");
            hideDialog();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
interface AddExperienceProps {
  hideDialog: () => void;
}
export const AddExperience: React.FC<AddExperienceProps> = ({ hideDialog }) => {
  const [title, setTitle] = useState("");
  const [fromWhere, setFromWhere] = useState("");
  const [description, setDescription] = useState("");
  const { systemSettings } = useSystemSettings();
  return (
    <div>
      <h1 className="text-3xl font-bold underline underline-offset-8">
        Add an Experience
      </h1>
      <div className="flex flex-col">
        <label className="form-control mt-5">
          <input
            required
            className="textarea textarea-bordered"
            placeholder="Experience name"
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="form-control mt-5">
          <input
            required
            className="textarea textarea-bordered"
            placeholder="From where did you get this experience?"
            onChange={(e) => setFromWhere(e.target.value)}
          />
        </label>
        <label className="form-control mt-5">
          <textarea
            required
            className="textarea textarea-bordered h-24"
            placeholder="Give a small description about that experience"
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
      </div>
      <div className="flex justify-end mt-5">
        <button
          className="btn btn-neutral mr-2"
          onClick={() => {
            var experience = {
              title: title,
              fromWhere: fromWhere,
              description: description,
            };
            console.log("experience", experience);
            axios
              .post(
                `${
                  systemSettings?.localServer
                }/api/candidate/experience/add/?ACCESS_KEY=${localStorage.getItem(
                  "access_key"
                )}`,
                experience
              )
              .then((res) => {
                console.log(res);
                hideDialog();
              });
          }}
        >
          Save
        </button>
        <button
          className="btn btn-neutral"
          onClick={() => {
            console.log("Closing dialog");
            hideDialog();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

interface UploadDocumentProps {
  hideDialog: () => void;
}
export const UploadDocument: React.FC<UploadDocumentProps> = ({
  hideDialog,
}) => {
  const [title, setTitle] = useState("");
  var [document, setDocument] = useState<File | null>(null);
  const { systemSettings } = useSystemSettings();
  return (
    <div>
      <h1 className="text-3xl font-bold underline underline-offset-8">
        Upload a Document
      </h1>
      <div className="flex flex-col">
        <label className="form-control mt-5">
          <input
            required
            className="textarea textarea-bordered"
            placeholder="Title of the document"
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs mt-5"
          onChange={async (e) => {
            console.log(e.target.files![0]);
            document = e.target.files![0];
            await setDocument(e.target.files![0]);
            console.log(document);
          }}
        />
      </div>
      <div className="flex justify-end mt-5">
        <button
          className="btn btn-neutral mr-2"
          onClick={() => {
            var formData = new FormData();
            console.log("Document", document);
            formData.append("document", document!);
            formData.append("title", title);
            console.log("Document", formData);
            axios
              .post(
                `${
                  systemSettings?.localServer
                }/api/candidate/document/add/?ACCESS_KEY=${localStorage.getItem(
                  "access_key"
                )}`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              )
              .then((res) => {
                console.log(res);
                hideDialog();
              });
          }}
        >
          Save
        </button>
        <button
          className="btn btn-neutral"
          onClick={() => {
            console.log("Closing dialog");
            hideDialog();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

interface UploadProfilePictureProps {
  hideDialog: () => void;
}
export const UploadProfilePicture: React.FC<UploadProfilePictureProps> = ({
  hideDialog,
}) => {
  var [photo, setPhoto] = useState<File | null>(null);
  const { systemSettings } = useSystemSettings();
  return (
    <div>
      <h1 className="text-3xl font-bold underline underline-offset-8">
        Upload Profile Photo
      </h1>
      <div className="flex flex-col">
        <input
          type="file"
          className="file-input file-input-bordered w-full max-w-xs mt-5"
          onChange={async (e) => {
            console.log(e.target.files![0]);
            photo = e.target.files![0];
            await setPhoto(e.target.files![0]);
            console.log(photo);
          }}
        />
      </div>
      <div className="flex justify-end mt-5">
        <button
          className="btn btn-neutral mr-2"
          onClick={() => {
            var formData = new FormData();
            console.log("photo", photo);
            formData.append("photo", photo!);
            axios
              .put(
                `${
                  systemSettings?.localServer
                }/api/candidate/profile/?ACCESS_KEY=${localStorage.getItem(
                  "access_key"
                )}`,
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              )
              .then((res) => {
                console.log(res);
                hideDialog();
              });
          }}
        >
          Save
        </button>
        <button
          className="btn btn-neutral"
          onClick={() => {
            console.log("Closing dialog");
            hideDialog();
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
