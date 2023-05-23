import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Model from "./Model";
import moment from "moment/moment";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const fetchTable = () => {
  return getDocs(collection(db, "collages")).then((res) => {
    const array = [];
    res.forEach((doc) => {
      array.push({ id: doc.id, ...doc.data() });
    });
    return array[0].data;
  });
};

const editAllCollages = (body) => {
  return setDoc(doc(db, "collages", "data"), {
    data: body,
  });
};

const TableWithReactQueryFirebase = () => {
  const [openEmojiId, setOpenEmojiId] = useState(0);
  const [input, setInput] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [rowData, setRowData] = useState({});

  // fetch data
  const {
    data: collagesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery("collages", fetchTable);

  // mutation funcs
  const queryClient = useQueryClient();

  const { mutate: mutateAllCollages } = useMutation(editAllCollages, {
    onSuccess: () => {
      queryClient.invalidateQueries("collages");
    },
  });

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("restTime"))) {
      localStorage.setItem(
        "restTime",
        JSON.stringify(new Date(moment().endOf("day").format()).getTime())
      );
    }

    const restTime = JSON.parse(localStorage.getItem("restTime"));

    if (new Date().getTime() > restTime) {
      if (!isLoading) {
        mutateAllCollages(
          collagesData?.map((c) => {
            return {
              ...c,
              emoji: "",
              details: "",
            };
          })
        );
        localStorage.setItem(
          "restTime",
          JSON.stringify(new Date(moment().endOf("day").format()).getTime())
        );
      }
    }
  }, [mutateAllCollages, isLoading]);

  // handle enter key press
  const enterPressHandler = (e, row) => {
    if (e.key === "Enter") {
      mutateAllCollages(
        collagesData?.map((c) => {
          return c?.id === row?.id
            ? {
                ...c,
                details: input.trim(),
              }
            : c;
        })
      );
      setInput("");
      setModalShow(false);
    }
  };

  const columns = [
    {
      name: "id",
      selector: (row) => row?.id,
      width: "50px",
    },
    {
      name: "Collage Name",
      selector: (row) => row?.collageName,
      width: "200px",
    },
    {
      name: "Select Emoji",
      width: "200px",
      selector: (row) => {
        return (
          <>
            <button
              className="main_btn"
              onClick={() => {
                setOpenEmojiId(row?.id);
                if (openEmojiId !== 0) {
                  setOpenEmojiId(0);
                }
              }}
            >
              Select Emoji
            </button>
            {row?.id === openEmojiId && (
              <EmojiPicker
                height={400}
                width={300}
                onEmojiClick={(emojiData) => {
                  mutateAllCollages(
                    collagesData?.map((c) => {
                      return c?.id === row?.id
                        ? {
                            ...c,
                            emoji: `${emojiData.names[0]} ${emojiData.emoji}`,
                          }
                        : c;
                    })
                  );
                  setOpenEmojiId(0);
                }}
                lazyLoadEmojis={true}
              />
            )}
          </>
        );
      },
    },
    {
      name: "Status",
      selector: (row) => row?.emoji,
      width: "300px",
    },
    {
      name: "Details",
      selector: (row) => row?.details,
      width: "350px",
    },
    {
      name: "Add Details",
      selector: (row) => {
        return (
          <>
            <button
              className="main_btn"
              onClick={() => {
                setModalShow(true);
                setRowData(row);
                setInput(row?.details);
              }}
            >
              Add Details
            </button>
          </>
        );
      },
    },
  ];

  if (isLoading) {
    return <h2>Loading....</h2>;
  }

  if (isError) {
    return <h2>{error}</h2>;
  }

  return (
    <>
      <div className="container">
        <h1 className="heading">
          my today mode 😄 {moment().format("DD/MM/yyyy")}
        </h1>
        <DataTable columns={columns} data={collagesData} />
      </div>
      <Model
        header={"Add Details"}
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          setRowData({});
        }}
        updateButton={"Update"}
        footer={false} // if u don't want footer === false
        size={"lg"}
      >
        <textarea
          className="input"
          placeholder="add more details"
          type="text"
          onKeyDown={(e) => {
            enterPressHandler(e, rowData);
          }}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
          rows={5}
        />
      </Model>
    </>
  );
};

export default TableWithReactQueryFirebase;
