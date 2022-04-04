# React Scheduler Component

[![npm package](https://img.shields.io/npm/v/@aldabil/react-scheduler/latest.svg)](https://www.npmjs.com/package/@aldabil/react-scheduler)
[![Twitter URL](https://img.shields.io/twitter/url?label=%40aldabil&style=social&url=https%3A%2F%2Ftwitter.com%2Fintent%2Ffollow%3Fscreen_name%3Daldabil21)](https://twitter.com/intent/follow?screen_name=aldabil21)

## Installation

```jsx
npm i @aldabil/react-scheduler
```

## Usage

```jsx
import { Scheduler } from "@aldabil/react-scheduler";
```

## Example

```jsx
<Scheduler
  view="month"
  events={[
    {
      event_id: 1,
      title: "Event 1",
      start: new Date("2021/5/2 09:30"),
      end: new Date("2021/5/2 10:30"),
    },
    {
      event_id: 2,
      title: "Event 2",
      start: new Date("2021/5/4 10:00"),
      end: new Date("2021/5/4 11:00"),
    },
  ]}
/>
```

#### Options

| Option                  | Value                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| height                  | number. Min height of table. <br> _Default_: 600                                                                                                                                                                                                                                                                                                                                                                          |
| view                    | string. Initial view to load. options: "week", "month", "day". <br> _Default_: "week" (if it's not null)                                                                                                                                                                                                                                                                                                                  |
| month                   | Object. Month view props. <br> _default_: <pre>{<br>weekDays: [0, 1, 2, 3, 4, 5], <br>weekStartOn: 6, <br>startHour: 9, <br>endHour: 17,<br>}</pre>                                                                                                                                                                                                                                                                       |
| week                    | Object. Month view props. <br> _default_: <pre>{ <br>weekDays: [0, 1, 2, 3, 4, 5], <br>weekStartOn: 6, <br>startHour: 9, <br>endHour: 17,<br>step: 60<br> }</pre>                                                                                                                                                                                                                                                         |
| day                     | Object. Month view props. <br> _default_: <pre>{<br>startHour: 9, <br>endHour: 17, <br>step: 60<br> }</pre>                                                                                                                                                                                                                                                                                                               |
| selectedDate            | Date. Initial selected date. <br>_Default_: new Date()                                                                                                                                                                                                                                                                                                                                                                    |
| events                  | Array of Objects. <br>_Default_: []                                                                                                                                                                                                                                                                                                                                                                                       |
| remoteEvents            | Function(query: string). Return promise of array of events. Used for remote data. Query returns start and end timestamps as the user navigation changes the dates currently in view. Example query value: <pre>?start=Sat May 08 2021 00:00:00 GMT+0100 (British Summer Time)&end=Thu May 13 2021 23:59:59 GMT+0100 (British Summer Time).</pre> Working example visible here: https://codesandbox.io/s/remote-data-j13ei |
| fields                  | Array of extra fields with configurations. <br> Example: <pre> { <br> name: "description", <br> type: "input" , <br> config: { label: "Description", required: true, min: 3, email: true, variant: "outlined", ....<br>}</pre>                                                                                                                                                                                            |
| loading                 | boolean. Loading state of the calendar table                                                                                                                                                                                                                                                                                                                                                                              |
| onConfirm               | Function(event, action). Return promise with the new added/edited event use with remote data. <br> _action_: "add", "edit"                                                                                                                                                                                                                                                                                                |
| onDelete                | Function(id) Return promise with the deleted event id to use with remote data.                                                                                                                                                                                                                                                                                                                                            |
| customEditor            | Function(scheduler). Override editor modal. <br> Provided prop _scheduler_ object with helper props: <br> <pre>{<br>state: state obj, <br>close(): void<br>loading(status: boolean): void<br>edited?: ProcessedEvent<br>onConfirm(event: ProcessedEvent, action:EventActions): void<br>}</pre>                                                                                                                            |
| viewerExtraComponent    | Function(fields, event) OR Component. Additional component in event viewer popper                                                                                                                                                                                                                                                                                                                                         |
| resources               | Array. Resources array to split event views with resources <br>_Example_ <pre>{<br>assignee: 1,<br>text: "User One", <br>subtext: "Sales Manager", <br>avatar: "https://picsum.photos/200/300", <br>color: "#ab2d2d",<br> }</pre>                                                                                                                                                                                         |
| resourceFields          | Object. Map the resources correct fields. <br>_Example_: <pre>{<br> idField: "admin_id", <br>textField: "title", <br>subTextField: "mobile", <br>avatarField: "title", <br>colorField: "background",<br> }</pre>                                                                                                                                                                                                          |
| recourseHeaderComponent | Function(resource). Override header component of resource                                                                                                                                                                                                                                                                                                                                                                 |
| resourceViewMode        | Display resources mode. <br>_Options_: "default", "tabs"                                                                                                                                                                                                                                                                                                                                                                  |
| direction               | string. Table direction. "rtl", "ltr"                                                                                                                                                                                                                                                                                                                                                                                     |
| dialogMaxWidth          | Edito dialog maxWith. Ex: "lg", "md", "sm"... _Default_:"md"                                                                                                                                                                                                                                                                                                                                                              |
| locale                  | Locale of date-fns. _Default_:enUS                                                                                                                                                                                                                                                                                                                                                                                        |
| onEventDrop             | Function(droppedOn: Date, updatedEvent: ProcessedEvent, originalEvent: ProcessedEvent). Return a promise, used to update remote data of the dropped event. Return an event to update state internally, or void if event state is managed within component                                                                                                                                                                 |

### Demos

- [Basic](https://codesandbox.io/s/react-scheduler-demo-standard-v96bd)
- [Remote Data](https://codesandbox.io/s/remote-data-j13ei)
- [Custom Fields](https://codesandbox.io/s/custom-fields-b2kbv)
- [Editor/Viewer Override](https://codesandbox.io/s/customeditor-tt2pf)
- [Resources/View Mode](https://codesandbox.io/s/resources-7wlcy)
- [Custom Cell Action](https://codesandbox.io/s/custom-cell-action-n02dv)

### Todos

- [ ] Tests
- [x] Drag&Drop - partially
- [ ] Resizable
- [ ] Recurring events
- [ ] Localization
