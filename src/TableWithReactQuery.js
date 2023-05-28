import axios from "axios";
import EmojiPicker from "emoji-picker-react";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Model from "./components/Model";
import moment from "moment/moment";

const Url =
  "http://localhost:4000"; /* "https://json-server-vercel-main-elsharqawy50.vercel.app/" */

const fetchTable = () => {
  return axios.get(`${Url}/collages`);
};

const fetchDate = () => {
  return axios.get(`${Url}/restTime`);
};

const editAllCollages = (body) => {
  return axios.put(`${Url}/collages`, { data: body });
};

const editDate = (body) => {
  return axios.put(`${Url}/restTime`, { time: body });
};

const Table = () => {
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

  const { data: restTimeData } = useQuery("restTime", fetchDate);

  // mutation funcs
  const queryClient = useQueryClient();

  const { mutate: mutateAllCollages } = useMutation(editAllCollages, {
    onSuccess: () => {
      queryClient.invalidateQueries("collages");
    },
    onError: () => {
      // refetch();
    },
  });

  const { mutate: mutateDate } = useMutation(editDate, {
    onSuccess: () => {
      queryClient.invalidateQueries("restTime");
    },
    onError: () => {
      // refetch();
    },
  });

  useEffect(() => {
    if (new Date().getTime() > restTimeData?.data.time) {
      if (!isLoading) {
        mutateAllCollages(
          collagesData?.data.data?.map((c) => {
            return {
              ...c,
              emoji: "",
              details: "",
            };
          })
        );
      }
      mutateDate(new Date(moment().endOf("day").format()).getTime());
    }
  }, [mutateDate, mutateAllCollages, isLoading]);

  // handle enter key press
  const enterPressHandler = (e, row) => {
    if (e.key === "Enter") {
      mutateAllCollages(
        collagesData?.data.data?.map((c) => {
          return c?.id === row?.id
            ? {
                ...c,
                details: input,
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
    },
    {
      name: "Collage Name",
      selector: (row) => row?.collageName,
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
                  mutateAllCollages(
                    collagesData?.data.data?.map((c) => {
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
      selector: (row) => <p>{row?.emoji}</p>,
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
        <DataTable columns={columns} data={collagesData.data.data} />
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

export default Table;

// import axios from "axios";
// import EmojiPicker from "emoji-picker-react";
// import React, { useEffect, useState } from "react";
// import DataTable from "react-data-table-component";
// import { useMutation, useQuery, useQueryClient } from "react-query";
// import Model from "./Model";
// import moment from "moment/moment";

// const Url =
//   "http://localhost:4000"; /* "https://json-server-vercel-main-elsharqawy50.vercel.app/" */

// const fetchTable = () => {
//   return axios.get(`${Url}/collages`);
// };

// const fetchDate = () => {
//   return axios.get(`${Url}/restTime`);
// };

// const editCollage = ([id, body]) => {
//   return axios.put(`${Url}/collages/${id}`, body);
// };

// const editAllCollages = (body) => {
//   return axios.put(`${Url}/collages`, { data: body });
// };

// const editDate = (body) => {
//   return axios.put(`${Url}/restTime`, { time: body });
// };

// const Table = () => {
//   const [openEmojiId, setOpenEmojiId] = useState(0);
//   const [input, setInput] = useState("");
//   const [modalShow, setModalShow] = useState(false);
//   const [rowData, setRowData] = useState({});

//   // fetch data
//   const {
//     data: collagesData,
//     isLoading,
//     isError,
//     error,
//     refetch,
//   } = useQuery("collages", fetchTable);

//   const { data: restTimeData } = useQuery("collages", fetchDate);

//   // mutation funcs
//   const queryClient = useQueryClient();
//   const { mutate: mutateOne } = useMutation(editCollage, {
//     onSuccess: () => {
//       queryClient.invalidateQueries("collages");
//     },
//     onError: () => {
//       refetch();
//     },
//   });

//   const { mutate: mutateDate } = useMutation(editDate, {
//     onSuccess: () => {
//       queryClient.invalidateQueries("restTime");
//     },
//     onError: () => {
//       // refetch();
//     },
//   });

//   const { mutate: mutateAllCollages } = useMutation(editAllCollages, {
//     onSuccess: () => {
//       queryClient.invalidateQueries("restTime");
//     },
//     onError: () => {
//       refetch();
//     },
//   });

//   useEffect(() => {
//     if (
//       new Date().getTime() < new Date(moment().endOf("day").format()).getTime()
//     ) {
//       console.log("hi");
//       // mutateAllCollages([{ h: "dsd" }]);
//       mutateDate(new Date(moment().endOf("day").format()).getTime());
//     }
//   }, [mutateDate]);

//   // handle enter key press
//   const enterPressHandler = (e, row) => {
//     if (e.key === "Enter") {
//       mutateOne([
//         row?.id,
//         {
//           ...row,
//           details: input,
//         },
//       ]);
//       setInput("");
//       setModalShow(false);
//     }
//   };

//   const columns = [
//     {
//       name: "id",
//       selector: (row) => row?.id,
//     },
//     {
//       name: "Collage Name",
//       selector: (row) => row?.collageName,
//     },
//     {
//       name: "Select Emoji",
//       selector: (row) => {
//         return (
//           <>
//             <button
//               className="main_btn"
//               onClick={() => {
//                 setOpenEmojiId(row?.id);
//                 if (openEmojiId !== 0) {
//                   setOpenEmojiId(0);
//                 }
//               }}
//             >
//               Select Emoji
//             </button>
//             {row?.id === openEmojiId && (
//               <EmojiPicker
//                 height={400}
//                 width={300}
//                 onEmojiClick={(emojiData) => {
//                   mutateOne([
//                     row?.id,
//                     {
//                       ...row,
//                       emoji: `${emojiData.names[0]} ${emojiData.emoji}`,
//                     },
//                   ]);
//                   setOpenEmojiId(0);
//                 }}
//                 lazyLoadEmojis={true}
//               />
//             )}
//           </>
//         );
//       },
//     },
//     {
//       name: "Status",
//       selector: (row) => <p>{row?.emoji}</p>,
//       width: "300px",
//     },
//     {
//       name: "Details",
//       selector: (row) => row?.details,
//       width: "350px",
//     },
//     {
//       name: "Add Details",
//       selector: (row) => {
//         return (
//           <>
//             <button
//               className="main_btn"
//               onClick={() => {
//                 setModalShow(true);
//                 setRowData(row);
//                 setInput(row?.details);
//               }}
//             >
//               Add Details
//             </button>
//           </>
//         );
//       },
//     },
//   ];

//   if (isLoading) {
//     return <h2>Loading....</h2>;
//   }

//   if (isError) {
//     return <h2>{error}</h2>;
//   }

//   return (
//     <>
//       <div className="container">
//         <h1 className="heading">
//           my today mode 😄 {moment().format("DD/MM/yyyy")}
//         </h1>
//         <DataTable columns={columns} data={collagesData.data} />
//       </div>
//       <Model
//         header={"Add Details"}
//         show={modalShow}
//         onHide={() => {
//           setModalShow(false);
//           setRowData({});
//         }}
//         updateButton={"Update"}
//         footer={false} // if u don't want footer === false
//         size={"lg"}
//       >
//         <textarea
//           className="input"
//           placeholder="add more details"
//           type="text"
//           onKeyDown={(e) => {
//             enterPressHandler(e, rowData);
//           }}
//           value={input}
//           onChange={(e) => {
//             setInput(e.target.value.trim());
//           }}
//           rows={5}
//         />
//       </Model>
//     </>
//   );
// };

// export default Table;
