import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Model from "./components/Model";
import moment from "moment/moment";
import Form from "./components/AddForm";
import { editIDsInArray } from "./helpers/functions";
import {
  editAllCollages,
  editDate,
  fetchCollagesTable,
  fetchDate,
} from "./apis/api";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

const TableWithSwrFirebase = () => {
  const [openEmojiId, setOpenEmojiId] = useState(0);
  const [input, setInput] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [rowData, setRowData] = useState({});

  // fetch funcs
  const {
    data: collagesData,
    error,
    isLoading,
  } = useSWR("collages", fetchCollagesTable);

  const { data: restTimeData, isLoading: isLoadingDate } = useSWR(
    "restTime",
    fetchDate
  );

  // mutation funcs
  const { trigger: mutateAllCollages } = useSWRMutation(
    "collages",
    (url, { arg: body }) => editAllCollages(body)
  );

  const { trigger: mutateDate } = useSWRMutation(
    "restTime",
    (url, { arg: body }) => editDate(body)
  );

  // reset data everyday morning
  useEffect(() => {
    if (new Date().getTime() > restTimeData) {
      if (!isLoading && !isLoadingDate) {
        mutateAllCollages(
          collagesData?.map((c) => {
            return {
              ...c,
              emoji: "",
              details: "",
            };
          })
        );
        mutateDate(new Date(moment().endOf("day").format()).getTime());
      }
    }
  }, [mutateDate, mutateAllCollages, isLoading, isLoadingDate]);

  // handle enter key press to add status to collage
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

  const addCollageHandler = (value) => {
    const submittedArray = [
      ...collagesData,
      {
        collageName: value,
        details: "",
        emoji: "",
      },
    ];
    const newCollages = editIDsInArray(submittedArray);
    mutateAllCollages(newCollages);
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
      width: "170px",
    },
    {
      name: "Select Emoji",
      width: "150px",
      selector: (row) => {
        return (
          <>
            <button
              className="main_btn btn__outline-blue"
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
          <div className="gap-3 d-flex">
            <button
              className="main_btn btn__outline-blue"
              onClick={() => {
                setModalShow(true);
                setRowData(row);
                setInput(row?.details);
              }}
            >
              Add Details
            </button>
            <button
              className="main_btn btn__outline-red"
              onClick={() => {
                const deleteCollage = collagesData.filter(
                  (collage) => collage.id !== row.id
                );
                const newCollages = editIDsInArray(deleteCollage);
                mutateAllCollages(newCollages);
              }}
            >
              Delete
            </button>
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <h2>Loading....</h2>;
  }

  if (error) {
    return <h2>{error.message}</h2>;
  }

  return (
    <>
      <div className="container">
        <h1 className="heading">
          my today mode 😄 {moment().format("DD/MM/yyyy")}
        </h1>
        <Form onAddCollage={addCollageHandler} />
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
        footer={false}
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

export default TableWithSwrFirebase;
