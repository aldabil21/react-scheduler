import { Scheduler } from "./lib";
import {
  EVENTS,
  // , RECOURCES
} from "./events";

function App() {
  return (
    <Scheduler
      events={EVENTS}
      // getRemoteEvents={async (q) => {
      //   console.log(q);
      //   return new Promise((res) => {
      //     setTimeout(() => {
      //       res(EVENTS);
      //     }, 1000);
      //   });
      // }}
      // eventRenderer={(event) => <>{event.title}</>}
      // dialogMaxWidth="sm"
      // loading={loading}
      // view="month"
      // editable={false}
      // deletable={false}
      // draggable={false}
      // selectedDate={new Date()}
      // height={800}
      // week={{
      //   weekDays: [0, 1, 2, 3, 4, 5, 6],
      //   weekStartOn: 6,
      //   startHour: 10,
      //   endHour: 11,
      //   step: 1,
      // cellRenderer: () => {
      //   return <>week</>;
      // },
      // }}
      // month={{
      //   weekDays: [0, 1, 2, 3, 4, 5],
      //   weekStartOn: 6,
      //   startHour: 7,
      //   endHour: 15,
      //   cellRenderer: () => {
      //     return <h1>month</h1>;
      //   },
      // }}
      // day={{
      //   startHour: 6,
      //   endHour: 14,
      //   step: 60,
      //   cellRenderer: () => {
      //     return <h1>DAY</h1>;
      //   },
      // }}
      // day={{
      //   startHour: 8,
      //   endHour: 18,
      //   step: 20,
      // }}
      // navigation={false}
      // navigationPickerProps={{
      //   shouldDisableDate(day) {
      //     return true;
      //   },
      // }}
      // remoteEvents={async (query) => {
      //   await new Promise((res, rej) => {
      //     setTimeout(() => {
      //       // setEvents(EVENTS);
      //       res("");
      //     }, 1000);
      //   });
      //   // return null;
      //   // return EVENTS;
      // }}
      // resources={RECOURCES}
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
      //       // {
      //       //   id: 1,
      //       //   text: "One",
      //       //   value: 1,
      //       // },
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
      //       // setEvents((prev) => {
      //       //   return prev.filter((p) => p.event_id !== id);
      //       // });
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
      // viewerTitleComponent={(event) => <>{event.title}</>}
      // direction="rtl"
      //  locale={ptBR}
      //  hourFormat={"24"}
      //  translations={{
      //   navigation: {
      //     month: "Mês",
      //     week: "Semana",
      //     day: "Dia",
      //     today: "Hoje"
      //   },
      //   form: {
      //     addTitle: "Novo Evento",
      //     editTitle: "Editar Evento",
      //     confirm: "Confirmar",
      //     delete: "Excluir",
      //     cancel: "Cancelar",
      //   },
      //   event: {
      //     title: "Título",
      //     start: "Início",
      //     end: "Fim"
      //   },
      //   moreEvents: "mais..."
      // }}
      // onEventDrop={async (time, updated) => {
      //   return new Promise((res) => {
      //     setTimeout(() => {
      //       // setEvents((prev: any) => {
      //       //   return prev.map((e) =>
      //       //     e.event_id === updated.event_id ? updated : e
      //       //   );
      //       // });
      //       res(updated);
      //     }, 1000);
      //   });
      // }}
    />
  );
}

export default App;
