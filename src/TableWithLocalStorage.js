import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Model from "./components/Model";
import moment from "moment/moment";

const dummyCollages = [
  {
    id: 1,
    collageName: "Abdelrahman",
    details: "",
    emoji: "",
  },
  {
    id: 2,
    collageName: "Mahmoud Hesham",
    details: "",
    emoji: "",
  },
  {
    id: 3,
    collageName: "Beshoy",
    details: "",
    emoji: "",
  },
  {
    id: 4,
    collageName: "Mostafa",
    details: "",
    emoji: "",
  },
  {
    id: 5,
    collageName: "Thwaiba",
    details: "",
    emoji: "",
  },
  {
    id: 6,
    collageName: "Mohamed",
    details: "",
    emoji: "",
  },
  {
    id: 7,
    collageName: "Khaled",
    details: "",
    emoji: "",
  },
];

const editData = (array, row, key, value) => {
  return array.map((c) => {
    return c?.id === row?.id
      ? {
          ...c,
          [key]: value,
        }
      : c;
  });
};

const TableWithLocalStorage = () => {
  const [openEmojiId, setOpenEmojiId] = useState(0);
  const [input, setInput] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [rowData, setRowData] = useState({});
  const [collagesData, setCollagesData] = useState(dummyCollages);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("collages"))?.length > 0) {
      setCollagesData(JSON.parse(localStorage.getItem("collages")));
    }
    if (!JSON.parse(localStorage.getItem("restTime"))) {
      localStorage.setItem(
        "restTime",
        JSON.stringify(new Date(moment().endOf("day").format()).getTime())
      );
    }
  }, []);

  useEffect(() => {
    const restTime = JSON.parse(localStorage.getItem("restTime"));

    if (new Date().getTime() > restTime) {
      setCollagesData(dummyCollages);
      localStorage.setItem("collages", JSON.stringify(dummyCollages));
      localStorage.setItem(
        "restTime",
        JSON.stringify(new Date(moment().endOf("day").format()).getTime())
      );
    }
  }, []);

  // handle enter key press
  const enterPressHandler = (e, row) => {
    const newArray = editData(collagesData, row, "details", input);
    if (e.key === "Enter") {
      setCollagesData(newArray);
      localStorage.setItem("collages", JSON.stringify(newArray));
      setInput("");
      setModalShow(false);
    }
  };

  const columns = [
    {
      name: "id",
      selector: (row) => row?.id,
    },
    {
      name: "Collage Name",
      selector: (row) => row?.collageName,
      width: "200px",
    },
    {
      name: "Select Emoji",
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
                  const newArray = editData(
                    collagesData,
                    row,
                    "emoji",
                    `${emojiData.names[0]} ${emojiData.emoji}`
                  );
                  setCollagesData(newArray);
                  localStorage.setItem("collages", JSON.stringify(newArray));
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
            setInput(e.target.value.trim());
          }}
          rows={5}
        />
      </Model>
    </>
  );
};

export default TableWithLocalStorage;
