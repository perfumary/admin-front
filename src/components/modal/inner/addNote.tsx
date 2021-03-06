import React, { ChangeEvent, useRef } from "react";
import styled from "styled-components";
import { TextField } from "@mui/material";
import resizeImage, { dataURItoBlob } from "Shared/resizeImage";
import { useState } from "react";
import DropDown, { DropList } from "Components/dropdown";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import createNoteCategory from "Apis/adminApi/createNoteCategory";
import createNote from "Apis/adminApi/createNote";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { setNote, setNoteCategory } from "@/store/slices/perfume";
import { RootState } from "@/store/reducer";

interface Props {
  closeModal: () => void;
}

const AddNoteModal: React.FC<Props> = ({ closeModal }) => {
  const [name, setName] = useState("");
  const [englishName, setEnglishName] = useState("");
  const imagesRef = useRef<HTMLInputElement>(null);
  const dataRef = useRef<Blob | null>(null);
  const [imageName, setImageName] = useState("");
  const [imageSrc, setImageSrc] = useState("");
  const { noteCategories } = useSelector((state: RootState) => state.perfume);
  const [category, setCategory] = useState<DropList | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [isOpenInner, setIsOpenInner] = useState(false);
  const dispatch = useDispatch();

  const preViewImage = (e: ChangeEvent<HTMLInputElement>) => {
    const callback = (blob: Blob, dataUri: string) => {
      dataRef.current = blob;
      setImageSrc(dataUri);
    };
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target) return;
        if ((e.target.result?.toString().length || 0) / 1024 / 1024 < 1) {
          dataRef.current = dataURItoBlob(e.target.result as string);
          setImageSrc(e.target.result?.toString() || "");
          return;
        }
        resizeImage(e.target.result as string, callback);
      };
      setImageName(e.target.files[0].name);
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const addCategory = async () => {
    try {
      const noteCategories = await createNoteCategory({ name: categoryName });
      Swal.fire("??????", "???????????? ????????? ?????????????????????. ", "success");
      setIsOpenInner(false);
      dispatch(setNoteCategory({ noteCategories }));
    } catch (e) {
      console.log(e);
      Swal.fire("??????", "???????????? ????????? ?????????????????????. ???????????? ??????????????? ??????????????????.", "error");
    }
  };
  const addNote = async () => {
    try {
      const formData = new FormData();
      formData.append("kor", name);
      formData.append("eng", englishName);
      formData.append("note_category_id", String(category?.id));
      if (dataRef.current) formData.append("image", dataRef.current);
      const notes = await createNote(formData);
      Swal.fire("??????", "?????? ????????? ?????????????????????. ", "success");
      console.log(notes);
      closeModal();
      dispatch(setNote({ notes }));
    } catch (e) {
      console.log(e);
      Swal.fire("??????", "?????? ????????? ?????????????????????. ???????????? ??????????????? ??????????????????.", "error");
    }
  };
  return (
    <>
      <Title>?????? ??????</Title>
      <ModalContent>
        <input
          type="file"
          id="images"
          accept="image/*"
          ref={imagesRef}
          onChange={preViewImage}
          style={{ display: "none" }}
        />
        <ImageSection>{imageSrc !== "" && <img src={imageSrc} alt="????????? ?????????" />}</ImageSection>
        <UploadImage htmlFor="images">
          <span>{imageName === "" ? "????????? ??????" : imageName}</span>
          <section>{imageName === "" ? "????????? ?????????" : "????????? ??????"}</section>
        </UploadImage>
        <InputSection>
          <TextField
            fullWidth
            label={<InputLabel>??????(??????)</InputLabel>}
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="small"
            variant="outlined"
          />
        </InputSection>
        <InputSection>
          <TextField
            fullWidth
            label={<InputLabel>??????(??????)</InputLabel>}
            value={englishName}
            onChange={(e) => setEnglishName(e.target.value)}
            size="small"
            variant="outlined"
          />
        </InputSection>
        <InputSection isFull>
          <InputTitle>
            <h3>????????????</h3>
            <button onClick={() => setIsOpenInner(true)}>
              <AddOutlinedIcon />
            </button>
          </InputTitle>
          <DropDown
            label="????????????"
            onChange={(value) => {
              const seleted = noteCategories.find((el) => el.id === value);
              if (!seleted) {
                alert("??????????????? ?????????????????????.");
                return;
              }
              setCategory({
                id: seleted.id,
                value: seleted.name,
                label: seleted.name,
              });
            }}
            list={noteCategories.map((el) => ({ id: el.id, value: el.name }))}
            isTitle={false}
            value={category}
          />
        </InputSection>
        <Submit onClick={addNote}>????????????</Submit>
        {isOpenInner && (
          <InnerModal>
            <button onClick={() => setIsOpenInner(false)} className="close">
              <CloseOutlinedIcon />
            </button>
            <InnerContent>
              <h3>???????????? ????????????</h3>
              <TextField
                fullWidth
                label={<InputLabel>??????</InputLabel>}
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                size="small"
                variant="outlined"
              />

              <Submit onClick={addCategory}>????????????</Submit>
            </InnerContent>
          </InnerModal>
        )}
      </ModalContent>
    </>
  );
};

export default AddNoteModal;
const Title = styled.h2`
  margin-bottom: 20px;
`;
const InputSection = styled.div<{ isFull?: boolean }>`
  width: ${(p) => (p.isFull ? "100%" : "calc(50% - 5px)")};
  margin-bottom: 10px;
`;

const InputLabel = styled.span`
  font-size: 12px;
`;
const ModalContent = styled.section`
  width: 500px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;
const UploadImage = styled.label`
  width: 100%;
  cursor: pointer;
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 12px;
  span {
    padding: 12px;
  }
  section {
    padding: 12px;
    border-left: 1px solid rgba(0, 0, 0, 0.3);
  }
`;
const ImageSection = styled.section`
  width: 100%;
  height: 300px;
  background: #eee;
  margin-bottom: 20px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;
const Submit = styled.button`
  width: 100%;
  background: ${(p) => p.theme.color.perfumery_pink};
  color: white;
  padding: 12px 0;
  border-radius: 4px;
`;
const InputTitle = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
  button {
    background: none;
  }
`;

const InnerModal = styled.section`
  width: 100%;
  height: 100%;
  background: white;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 201;
  .close {
    width: 20px;
    height: auto;
    position: absolute;
    top: 20px;
    right: 20px;
    background: none;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const InnerContent = styled.article`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  h3 {
    margin-bottom: 12px;
  }
  .MuiFormControl-root {
    margin-bottom: 12px;
  }
`;
