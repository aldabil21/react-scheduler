import { arSA } from "date-fns/locale";
import { Scheduler } from "./lib/Scheduler";
// import { EVENTS } from "./model/events";

const App = () => {
  return (
    <Scheduler
      // dialogMaxWidth="sm"
      // loading={loading}
      // view="month"
      // events={EVENTS}
      // week={null}
      // month={null}
      // day={null}
      // remoteEvents={async (query) => {
      //   return new Promise((res, rej) => {
      //     setTimeout(() => {
      //       res(EVENTS);
      //     }, 1000);
      //   });
      // }}
      // resources={[
      //   {
      //     admin_id: 1,
      //     title: "One",
      //     mobile: "555666777",
      //     avatar: "https://picsum.photos/200/300",
      //     color: "#ab2d2d",
      //   },
      //   {
      //     admin_id: 2,
      //     title: "Two",
      //     mobile: "555666777",
      //     avatar: "https://picsum.photos/200/300",
      //     color: "#58ab2d",
      //   },
      //   {
      //     admin_id: 3,
      //     title: "Three",
      //     mobile: "555666777",
      //     avatar: "https://picsum.photos/200/300",
      //     color: "#a001a2",
      //   },
      //   {
      //     admin_id: 4,
      //     title: "Four",
      //     mobile: "555666777",
      //     avatar: "https://picsum.photos/200/300",
      //     color: "#08c5bd",
      //   },
      // ]}
      // resourceFields={{
      //   idField: "admin_id",
      //   textField: "title",
      //   subTextField: "mobile",
      //   avatarField: "title",
      //   colorField: "color",
      // }}
      // resourceViewMode="tabs"
      // recourseHeaderComponent={(recourse) => {
      //   console.log(recourse);
      //   return <div>HAHA</div>;
      // }}
      // fields={[
      //   {
      //     name: "description",
      //     type: "input",
      //     config: { label: "Description", multiline: true, rows: 4 },
      //   },
      //   {
      //     name: "admin_id",
      //     type: "select",
      //     config: { label: "Assignee", required: true, multiple: "chips" },
      //     // default: [1, 2],
      //     options: [
      //       {
      //         id: 1,
      //         text: "One",
      //         value: 1,
      //       },
      //       {
      //         id: 2,
      //         text: "Two",
      //         value: 2,
      //       },
      //       {
      //         id: 3,
      //         text: "Three",
      //         value: 3,
      //       },
      //       {
      //         id: 4,
      //         text: "Four",
      //         value: 4,
      //       },
      //     ],
      //   },
      // ]}
      // onConfirm={async (event, action) => {
      //   console.log(action);
      //   return new Promise((res, rej) => {
      //     setTimeout(() => {
      //       res({
      //         ...event,
      //         event_id: event.event_id || Math.random(),
      //         // title: "From Custom",
      //         // start: new Date(new Date().setHours(11)),
      //         // end: new Date(new Date().setHours(18)),
      //       });
      //     }, 1000);
      //   });
      // }}
      // onDelete={async (id) => {
      //   return new Promise((res, rej) => {
      //     setTimeout(() => {
      //       res(id);
      //     }, 1000);
      //   });
      // }}
      // customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
      // viewerExtraComponent={(fields, e) => {
      //   return (
      //     <div>
      //       {Array.from("a".repeat(50)).map((a, i) => (
      //         <div key={i}>Extra</div>
      //       ))}
      //     </div>
      //   );
      //   // console.log(fields, e);
      //   // return (
      //   //   <div>
      //   //     {fields.map((a, i) => (
      //   //       <div key={i}>{e.description}</div>
      //   //     ))}
      //   //   </div>
      //   // );
      // }}
      direction="rtl"
      locale={arSA}
    />
  );
};

export { App };
