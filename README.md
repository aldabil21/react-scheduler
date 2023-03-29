# React Scheduler Component

[![npm package](https://img.shields.io/npm/v/@aldabil/react-scheduler/latest.svg)](https://www.npmjs.com/package/@aldabil/react-scheduler)
[![Twitter URL](https://img.shields.io/twitter/url?label=%40aldabil&style=social&url=https%3A%2F%2Ftwitter.com%2Fintent%2Ffollow%3Fscreen_name%3Daldabil21)](https://twitter.com/intent/follow?screen_name=aldabil21)

> :warning: **Notice**: This component uses `mui`/`emotion`/`date-fns`. if your project is not already using these libs, this component may not be suitable.

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

### Scheduler Props

| Prop                    | Value                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| height                  | number. Min height of table. <br> _Default_: 600                                                                                                                                                                                                                                                                                                                                                                                                                         |
| view                    | string. Initial view to load. options: "week", "month", "day". <br> _Default_: "week" (if it's not null)                                                                                                                                                                                                                                                                                                                                                                 |
| month                   | Object. Month view props. <br> _default_: <pre>{<br>weekDays: [0, 1, 2, 3, 4, 5], <br>weekStartOn: 6, <br>startHour: 9, <br>endHour: 17,<br>cellRenderer?:(props: CellProps) => JSX.Element,<br>navigation: true,<br>disableGoToDay: false<br>}</pre>                                                                                                                                                                                                                    |
| week                    | Object. Week view props. <br> _default_: <pre>{ <br>weekDays: [0, 1, 2, 3, 4, 5], <br>weekStartOn: 6, <br>startHour: 9, <br>endHour: 17,<br>step: 60,<br>cellRenderer?:(props: CellProps) => JSX.Element,<br>navigation: true,<br>disableGoToDay: false<br>}</pre>                                                                                                                                                                                                       |
| day                     | Object. Day view props. <br> _default_: <pre>{<br>startHour: 9, <br>endHour: 17, <br>step: 60,<br>cellRenderer?:(props: CellProps) => JSX.Element,<br>navigation: true<br>}</pre>                                                                                                                                                                                                                                                                                        |
| selectedDate            | Date. Initial selected date. <br>_Default_: new Date()                                                                                                                                                                                                                                                                                                                                                                                                                   |
| navigation              | boolean. Show/Hide top bar date navigation. <br>_Default_: true                                                                                                                                                                                                                                                                                                                                                                                                          |
| navigationPickerProps   | CalendarPickerProps for top bar date navigation. Ref: [CalendarPicker API](https://mui.com/x/api/date-pickers/calendar-picker/#main-content)                                                                                                                                                                                                                                                                                                                             |
| disableViewNavigator    | boolean. Show/Hide top bar date View navigator. <br>_Default_: false                                                                                                                                                                                                                                                                                                                                                                                                     |
| events                  | Array of ProcessedEvent. <br>_Default_: [] <br> <pre>type ProcessedEvent = {<br>event_id: number or string;<br>title: string;<br>start: Date;<br>end: Date;<br>disabled?: boolean;<br>color?: string;<br>editable?: boolean;<br>deletable?: boolean;<br>draggable?: boolean;<br>allDay?: boolean;<br>} </pre>                                                                                                                                                            |
| eventRenderer           | Function(event:ProcessedEvent): JSX.Element.<br> A function that overrides the event item render function, see demo _Custom Event Renderer_ below                                                                                                                                                                                                                                                                                                                        |
| editable                | boolean. Whether the event item will show the edit button, this is applied to all events, and can be overridden in each event property, see `ProcessedEvent` type.                                                                                                                                                                                                                                                                                                       |
| deletable               | boolean. Whether the event item will show the delete button, this is applied to all events, and can be overridden in each event property, see `ProcessedEvent` type.                                                                                                                                                                                                                                                                                                     |
| draggable               | boolean. Whether activate drag&drop for the events, this is applied to all events, and can be overridden in each event property, see `ProcessedEvent` type.                                                                                                                                                                                                                                                                                                              |
| getRemoteEvents         | Function(viewEvent). Return promise of array of events. Can be used as a callback to fetch events by parent component or fetch.<br><pre>type ViewEvent = { <br> start: Date;<br> end: Date;<br> view: "day" \| "week" \| "month";<br>}</pre>                                                                                                                                                                                                                             |
| fields                  | Array of extra fields with configurations. <br> Example: <pre> { <br> name: "description", <br> type: "input" , <br> config: { label: "Description", required: true, min: 3, email: true, variant: "outlined", ....<br>}</pre>                                                                                                                                                                                                                                           |
| loading                 | boolean. Loading state of the calendar table                                                                                                                                                                                                                                                                                                                                                                                                                             |
| onConfirm               | Function(event, action). Return promise with the new added/edited event use with remote data. <br> _action_: "add", "edit"                                                                                                                                                                                                                                                                                                                                               |
| onDelete                | Function(id) Return promise with the deleted event id to use with remote data.                                                                                                                                                                                                                                                                                                                                                                                           |
| customEditor            | Function(scheduler). Override editor modal. <br> Provided prop _scheduler_ object with helper props: <br> <pre>{<br>state: state obj, <br>close(): void<br>loading(status: boolean): void<br>edited?: ProcessedEvent<br>onConfirm(event: ProcessedEvent, action:EventActions): void<br>}</pre>                                                                                                                                                                           |
| customViewer            | Function(event: ProcessedEvent, close: () => void). Used to render fully customized content of the event popper. If used, `viewerExtraComponent` & `viewerTitleComponent` will be ignored                                                                                                                                                                                                                                                                                |
| viewerExtraComponent    | Function(fields, event) OR Component. Additional component in event viewer popper                                                                                                                                                                                                                                                                                                                                                                                        |
| viewerTitleComponent    | Function(event). Helper function to render custom title in event popper                                                                                                                                                                                                                                                                                                                                                                                                  |
| resources               | Array. Resources array to split event views with resources <br>_Example_ <pre>{<br>assignee: 1,<br>text: "User One", <br>subtext: "Sales Manager", <br>avatar: "https://picsum.photos/200/300", <br>color: "#ab2d2d",<br> }</pre>                                                                                                                                                                                                                                        |
| resourceFields          | Object. Map the resources correct fields. <br>_Example_: <pre>{<br> idField: "admin_id", <br>textField: "title", <br>subTextField: "mobile", <br>avatarField: "title", <br>colorField: "background",<br> }</pre>                                                                                                                                                                                                                                                         |
| recourseHeaderComponent | Function(resource). Override header component of resource                                                                                                                                                                                                                                                                                                                                                                                                                |
| resourceViewMode        | Display resources mode. <br>_Options_: "default", "tabs"                                                                                                                                                                                                                                                                                                                                                                                                                 |
| direction               | string. Table direction. "rtl", "ltr"                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| dialogMaxWidth          | Edito dialog maxWith. Ex: "lg", "md", "sm"... _Default_:"md"                                                                                                                                                                                                                                                                                                                                                                                                             |
| locale                  | Locale of date-fns. _Default_:enUS                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| hourFormat              | Hour format. <br>_Options_: "12", "24"..._Default_: "12"                                                                                                                                                                                                                                                                                                                                                                                                                 |
| timeZone                | String, time zone IANA ID: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones                                                                                                                                                                                                                                                                                                                                                                                  |
| translations            | Object. Translations view props. <br> _default_: <pre>{<br> navigation: {<br> month: "Month",<br> week: "Week",<br> day: "Day",<br> today: "Today"<br> },<br> form: {<br> addTitle: "Add Event",<br> editTitle: "Edit Event",<br> confirm: "Confirm",<br> delete: "Delete",<br> cancel: "Cancel"<br> },<br> event: {<br> title: "Title",<br> start: "Start",<br> end: "End",<br> allDay: "All Day"<br>},<br> moreEvents: "More...",<br> loading: "Loading..."<br>}</pre> |
| onEventDrop             | Function(droppedOn: Date, updatedEvent: ProcessedEvent, originalEvent: ProcessedEvent). Return a promise, used to update remote data of the dropped event. Return an event to update state internally, or void if event state is managed within component                                                                                                                                                                                                                |
| onEventClick            | Function(event: ProcessedEvent): void. Triggered when an event item is clicked                                                                                                                                                                                                                                                                                                                                                                                           |

<br>

### SchedulerRef

Used to help manage and control the internal state of the `Scheduler` component from outside of `Scheduler` props, Example:

```js
import { Scheduler } from "@aldabil/react-scheduler";
import type { SchedulerRef } from "@aldabil/react-scheduler/types"

const SomeComponent = () => {
  const calendarRef = useRef<SchedulerRef>(null);

  return <Fragment>
    <div>
      <Button onClick={()=>{
        calendarRef.current.scheduler.handleState("day", "view");
      }}>
        Change View
      </Button>
      <Button onClick={()=>{
        calendarRef.current.scheduler.triggerDialog(true, {
          start: /*Put the start date*/,
          end: /*Put the end date*/
        })
      }}>
        Add Event Tomorrow
      </Button>
    </div>

    <Scheduler
      ref={calendarRef}
      events={EVENTS}
      //...
    />
  </Fragment>
};
```

The `calendarRef` holds the entire internal state of the Scheduler component. Perhaps the most useful method inside the `calendarRef` is `handleState`, example:

```
calendarRef.current.scheduler.handleState(value, key);
```

consider looking inside `SchedulerRef` type to see all fields & methods available.

### Demos

- [Basic](https://codesandbox.io/s/react-scheduler-demo-standard-v96bd)
- [Remote Data](https://codesandbox.io/s/remote-data-j13ei)
- [Custom Fields](https://codesandbox.io/s/custom-fields-b2kbv)
- [Editor/Viewer Override](https://codesandbox.io/s/customeditor-tt2pf)
- [Resources/View Mode](https://codesandbox.io/s/resources-7wlcy)
- [Custom Cell Action](https://codesandbox.io/s/custom-cell-action-n02dv)
- [Custom Event Renderer](https://codesandbox.io/s/custom-event-renderer-rkf4xw)

### Todos

- [ ] Tests
- [x] Drag&Drop - partially
- [ ] Resizable
- [ ] Recurring events
- [x] Localization
- [x] Hour format 12 | 24
