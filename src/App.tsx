import { Scheduler } from "./lib/Scheduler";

const App = () => {
  return (
    <Scheduler
    // loading={loading}
    // view="month"
    // events={EVENTS}
    // remoteEvents={async (query) => {
    //   console.log(query);
    //   return new Promise((res, rej) => {
    //     setTimeout(() => {
    //       res(EVENTS);
    //     }, 1000);
    //   });
    // }}
    // resources={[
    // {
    //   admin_id: 1,
    //   title: "One",
    //   mobile: "555666777",
    //   avatar: "https://picsum.photos/200/300",
    //   color: "#ab2d2d",
    // },
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
    // week={{
    //   weekDays: [0, 1, 2, 3, 4, 5, 6],
    //   weekStartOn: 0,
    //   startHour: 8,
    //   endHour: 22,
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
    //     config: { label: "Assignee", required: true },
    //     default: "",
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
    //         text: "Four",
    //         value: 3,
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
    />
  );
};

export { App };
