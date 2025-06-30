// Import our custom CSS


// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'


import {createCalendar, DayGrid, TimeGrid, List, Interaction} from '@event-calendar/core';
import eventPopOvers from './eventPopOvers'
// Import CSS if your build tool supports it
import '@event-calendar/core/index.css';
import '../scss/styles.scss'


//Setup popover form
const formHTML = document.querySelector('[data-name="popover-form"]');
//const popOverHTML = document.querySelector('[data-name="popover-event-details"]');
let calendarEventFormRef = null; // Will be used to reference the create popover
let isPreviewEvent = false; // Variable used to store if the current event is a preview event.
let currentEvent = null; // Used to store the current event that the user is interacting with
//let currentEventElement = null; //Used to store a refence to the dom element. The event element gets re rendered everytime it's moved or changed. Used mainly for the popovers
//let numberOfChanges = 0;
let formType = 'popover' // The defualt form type. Can be popover or offcanvas. On mobile devices off canvas will be used.
const eventColoursArray = [
    { name: "cornflowerblue", value: "cornflowerblue" },
    { name: "gold", value: "rgb(246, 191, 38)" },
    { name: "green", value: "mediumaquamarine" },
    { name: "lightcoral", value: "lightcoral" },
    { name: "orange", value: "orange" },
    { name: "purple", value: "orchid" },
    { name: "gray", value: "slategray" }   
]

const eventPopOver = new eventPopOvers( eventColoursArray );


console.log( eventColoursArray )


/*
                                                                            Creates the popover

*/

function createPopoverNewEvent( popOverTarget, formAction = "new", animation = true ) {
    //currentEventElement = document.querySelector(".event-preview");
    //console.log( popOverTarget,  animation);
    let title = "New Event Details";
    if ( formAction == "new" )
    {
        title = "New Event Details"
    } else {
        title = "Update Event Details"
    }
    const calendarPopover = new bootstrap.Popover(popOverTarget, { // Create popover object
        html: true,
        title: title,
        animation: animation,
        trigger: 'manual', // Set to manual so that when a user selects anywhere in the calendar we can cancel the preview event and the related popover
        content: formHTML,
        toggleEnabled: false
    });
    calendarPopover.show();
    //console.log( calendarPopover )
    return calendarPopover;
}














/*

                                                                            Function to create Toast Element

*/
function createToast(message, title, delay = 1000) 
{
    const toastContainer = document.getElementById('toast-container');

    const toastElement = document.createElement('div');
    toastElement.classList.add('toast', 'fade');
    toastElement.setAttribute('role', 'alert');
    toastElement.setAttribute('aria-live', 'assertive');
    toastElement.setAttribute('aria-atomic', 'true');

    const toastHeader = document.createElement('div');
    toastHeader.classList.add('toast-header');
    toastHeader.innerHTML = `
        <strong class="me-auto">${title}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
    `;

    const toastBody = document.createElement('div');
    toastBody.classList.add('toast-body');
    toastBody.textContent = message;

    toastElement.appendChild(toastHeader);
    toastElement.appendChild(toastBody);
    toastContainer.appendChild(toastElement);

    const toast = new bootstrap.Toast(toastElement, { "delay": delay });
    toast.show();

    toastElement.addEventListener('hidden.bs.toast', function () {
        toastElement.remove();
    });

    return toast
}






//Create the options for the select drop down for the times
//Will be used to limit the end time start times from the event start time + 30min
function createTimeOptions(targetElement, startHour, endHour, intervalMinutes) {
    if ( targetElement ){
        const selectElement = document.getElementById(targetElement);
        for (let hour = startHour; hour <= endHour; hour++) {2
          for (let minute = 0; minute < 60; minute += intervalMinutes) {
            let timeValue = String(hour).padStart(2, '0') + ":" + String(minute).padStart(2, '0');
            let texValue;
            if ( hour > 12 )
            {
                texValue = String(hour - 12).padStart(2, '0') + ":" + String(minute).padStart(2, '0');
            } else 
            {
                texValue = String(hour).padStart(2, '0') + ":" + String(minute).padStart(2, '0');
            }
            const option = document.createElement('option');
            const meridiem = hour>= 12 ? "pm" : "am"
            option.value = timeValue;
            option.text = texValue + " " + meridiem;
            selectElement.add(option);
          }
        }
    }
  }





function finaliseNewEvent( ) {
    console.log( currentEvent );
}

/*

                                                                                                       Event form funtions

*/

 function createEventForm( target, formAction = "new", animation = true ) {
   
    if ( formType == 'popover')
    {
            
        const popOverRref =  createPopoverNewEvent( target, formAction, animation );
        populateEventForm( currentEvent, popOverRref.tip.childNodes[2], formAction );
        return popOverRref;
    }

 }

 function updateEventFrom() {
    if ( formType == 'popover' && calendarEventFormRef )
        {
            calendarEventFormRef.update();
        }
 }

 function disposeEventForm() {
    if ( formType == 'popover' && calendarEventFormRef )
        {
            calendarEventFormRef.dispose();
            calendarEventFormRef = null;
        } 
 }



//Populate the popover form with data from the event created by the select / drag event
/*

 info of the event passed to the form
 formTarget is the reference to the HTML of the form element in the popover element
 forAction can be set to new or update. Sets the form action and the button that appears.

*/
function populateEventForm( info, formTarget, formAction ) {
    console.log( "form action ", formAction )
    const colourOptions = formTarget.querySelectorAll('input[name="EventColourOptions"]');
    //console.log( colourOptions );
    colourOptions.forEach( colorOption => {
        //console.log ( colorOption.value ) 
        if ( colorOption.value == info.backgroundColor ) 
        {
            console.log( colorOption.value )
            colorOption.checked = true;
        }
    })
    //Create the dropdown for the end time starting from the start time
    createTimeOptions('endTime', parseInt( Intl.DateTimeFormat("en-GB", { hour: '2-digit' }).format(info.start) ), 24, 30 );
    document.getElementById('endTime').remove(0); // Remove the first item in then end time drop down so that the event has a minimum time duration
    if ( info.title == "untitled") {
        formTarget.querySelector("#eventName").value = "";
    } else {
        formTarget.querySelector("#eventName").value = info.title
    }
    //formTarget.querySelector("#startDate").value = `${info.start.getFullYear()}-${Intl.DateTimeFormat("en-GB", { month: '2-digit' }).format(info.start)}-${info.start.getDate()}`;
    formTarget.querySelector("#startDate").value = `${info.start.getFullYear()}-${Intl.DateTimeFormat("en-GB", { month: '2-digit' }).format(info.start)}-${Intl.DateTimeFormat("en-GB", { day: '2-digit' }).format(info.start)}`;
    console.log( `${info.start.getFullYear()}-${Intl.DateTimeFormat("en-GB", { month: '2-digit' }).format(info.start)}-${Intl.DateTimeFormat("en-GB", { day: '2-digit' }).format(info.start)}` )
    formTarget.querySelector("#startTime").value = `${Intl.DateTimeFormat("en-GB", { hour: '2-digit' }).format(info.start)}:${Intl.DateTimeFormat("en-GB", { minute: '2-digit' }).format(info.start)}`;
    formTarget.querySelector("#endTime").value = `${Intl.DateTimeFormat("en-GB", { hour: '2-digit' }).format(info.end)}:${Intl.DateTimeFormat("en-GB", { minute: '2-digit' }).format(info.end)}`;
    if ( !info.extendedProps.eventDescription) {
        formTarget.querySelector("#EventDescription").value = "";
    } else {
        formTarget.querySelector("#EventDescription").value = info.extendedProps.eventDescription
    }
    
    //const isPreview = info.classNames.find((element) => element == "event-preview");
    //console.log( isPreview )
    if ( formAction == "new" )
    {
        //formTarget.querySelector("#formActionSubmit").classList.remove("d-none")
        formTarget.querySelector("#formActionSubmit").textContent = "Save New Event"
        formTarget.querySelector("#formActionSubmit").setAttribute('button-action', 'new');
        

    } else
    {
        formTarget.querySelector("#formActionSubmit").setAttribute('button-action', 'update');
        formTarget.querySelector("#formActionSubmit").textContent = "Save updates"
        
    }
}


/*

                                                                                                Preview event functions

*/
function clearcurrentEvent ()
{
    if ( currentEvent ) {
        if ( isPreviewEvent )
        {
            console.log( "clear preview event");
            ec.removeEventById( currentEvent.id );
            currentEvent = null;
            disposeEventForm();
            calendarEventFormRef = null;
            isPreviewEvent = null;
        } else {

            ec.removeEventById( currentEvent.id );
            currentEvent = null;
            disposeEventForm(); 
            createToast( "Deleting event", "Changes Saved" );
            setTimeout(() => {

                createToast( "Event deleted", "Changes Saved" );
        
            }, 1000); 
        }
    }
}


//Triggers when a use drags the cursor across the calendar to create an event
function previewEventSetup( info ) {
    disposeEventForm();
    if ( isPreviewEvent ) { // If the current event is already a preview event clear it and create the new one
        clearcurrentEvent();
    } 
    //Setup the event info for the event preview state
    info.title = "untitled"
    info.id = Date.now()
    info.classNames = [ "event-preview", `id-${info.id}`  ]
    info.backgroundColor = "cornflowerblue";
    currentEvent = ec.addEvent( info );
    isPreviewEvent = true;
    ec.unselect();

    setTimeout(() => {
        
        console.log( calendarEventFormRef )
        calendarEventFormRef = createEventForm( document.querySelector( `.id-${currentEvent.id}` ), "new" );
        console.log( calendarEventFormRef )

    }, 50); 

}

// Used to convert the preview event into the finalised and saved event and resets all the references back to null
function createNewEvent()
{
    console.log( currentEvent.classNames )
    currentEvent.classNames = [ `id-${currentEvent.id}` ]; // Sets the additional classes for the event back to nothing because the event is no longer a preview event.
    ec.updateEvent( currentEvent );
    //createToast(`New event added ${currentEvent.title}`, "Event added" );
    currentEvent = null;
    isPreviewEvent = false;
    disposeEventForm();
    createToast( "Saving new event", "Changes Saved" );
    setTimeout(() => {

        createToast( "New event saved", "Changes Saved" );

    }, 1000); 
    //newStatusUpdate( "A new event has been created", "Event added" );
    
    //calendarEventFormRef = null; // Sets the calender form refence to null because it's no longer needed.
}


// Need to change the name of this
function updateEventContent( formAction ) // the formAction is passed through to tell the creatform funtion if it is a new or updated event
{
    //console.log( calendarEventFormRef )
    ec.updateEvent( currentEvent );
    
    setTimeout(() => {

        if ( formType == 'popover')
        {
            
            console.log( currentEvent )
            disposeEventForm()
            calendarEventFormRef = createEventForm( document.querySelector( `.id-${currentEvent.id}` ) , formAction, false )

        }

    }, 50);

}


function updateEvent()
{
    if ( calendarEventFormRef )
    {
        disposeEventForm()   
    }
    setTimeout(() => {

        createToast( "Changes to event saved", "Changes Saved" );

    }, 1000);  
}








//Used to check if the user clicks off the temporally created event
//As the element targeted click event is the clicked element we need to get the parent object to find the ec-preview wrapper object
function onDateClicked( info ) {
    disposeEventForm();
    
    //console.log( currentEvent )
    if ( currentEvent ) {

        const eventElement = document.querySelector( `.id-${currentEvent.id}` )
        const clickTarget = info.jsEvent.target.parentElement;  // Get the parent object that has been clicked
        console.log( "find: ", eventElement.classList.contains( 'event-preview' ) )
        console.log( eventElement  )   
        if ( isPreviewEvent && eventElement.classList.contains( 'event-preview' ) )
        {
            
            if ( clickTarget !=  eventElement ) // Check to see if the user has clicked anywhere in the calendar except the current preview event. Might be redundant because of the calendars built in on event click event
            {
                
                clearcurrentEvent();
    
            }
    
        }

    } else {

    }
    if ( ec.getView().type == "timeGridWeek" )
    {
        console.log(" create new event ")
        const startDate = new Date(info.date);
        let endDate = new Date(info.date)
        endDate.setHours( endDate.getHours() + 1);
        console.log ( startDate, " ", endDate )
        //console.log ( info.allDay, " ", info.date )
    }
    //console.log ( info )
    //console.log ( ec.getView().type )
    //console.log(" create new event ")
    //console.log(" if week need to get time")


}




// For when a user clicks on an event
// Checks to see if the current event is a preview event, if not bring up info panel
// If it is a preview event then check to see if the target if the preview event. Is so do nothing is not clear the current event
function onEventClicked( info )
{
    console.log( "event clicked: " , isPreviewEvent, info.event.id )
    //disposeEventForm();
    setTimeout(() => {
       
        const targetElement = document.querySelector( `.id-${info.event.id}` );
        console.log( targetElement )
        if ( targetElement.classList.contains("event-preview") ) // If it is a preivew event do nothing, popover form already exists and is targeting the preview event
        {

                console.log( "has class event-preview ")

        } else 
        {
                
                if ( isPreviewEvent )
                {
                    clearcurrentEvent(); // Clears any reference to previously select events and clears any popovers 
                }
                if ( calendarEventFormRef )
                {
                    disposeEventForm();
                }
                currentEvent = info.event;
                //calendarEventFormRef = createPopoverEventClick( targetElement, currentEvent ); 
                eventPopOvers.creatUpdateEventPopOver( targetElement, currentEvent )
        }

    }, 50); 
}




function onEventDropped( info )
{

    console.log( "event dropped: " , isPreviewEvent, info.delta.seconds )
    if ( info.delta.seconds != 0 ) // Because this evnetDrop call back fires event if the event is dragged >0 pixels we need to check if the event has actually moved time / date slots 
    {
        console.log( "the event did move");
        
        setTimeout(() => {
            const targetElement = document.querySelector( `.id-${info.event.id}` );
            console.log( targetElement )
            if ( targetElement.classList.contains("event-preview") )
            {
                console.log( targetElement )
                disposeEventForm();
                currentEvent = info.event;
                calendarEventFormRef = createEventForm( targetElement );
                //console.log( calendarEventFormRef )
 
            } else 
            {
                
                if ( isPreviewEvent )
                {
                    clearcurrentEvent(); // Clears any reference to previously select events and clears any popovers 
                }
                if ( calendarEventFormRef )
                {
                    disposeEventForm();
                }
                createToast( "Saving changes to event", "Event Updated" );
                updateEvent();
            }
      
        }, 50); 


    }
        
        

}

function onEventresize( info )
{

    console.log( "event resized: " , isPreviewEvent, info )
    disposeEventForm();    
    setTimeout(() => {
       
        const targetElement = document.querySelector( `.id-${info.id}` );
        console.log( targetElement )
        if ( targetElement.classList.contains("event-preview") )
        {
            console.log( targetElement )
            disposeEventForm();
            currentEvent = info;
            calendarEventFormRef = createEventForm( targetElement, "new" );
            //console.log( calendarEventFormRef )

        } else 
        {
            
            if ( isPreviewEvent )
            {
                clearcurrentEvent(); // Clears any reference to previously select events and clears any popovers 
                console.log( " preview event was is present")
            }
            if ( calendarEventFormRef )
            {
                console.log( "clear form popover")                
                disposeEventForm();

            }
            createToast( "Saving changes to event", "Event Updated" );
            updateEvent();
        }

    }, 50); 
        

}

// Creates the format for the event.
// We changed the default so that the title would come first
function createEventContent( info )
{
    let title = document.createElement('h5');
    title.classList.add('ec-event-title');
    title.innerHTML = info.event.title;

    let time = document.createElement('div');
    time.classList.add('ec-event-time');
    time.innerText = info.timeText;
    
    let extra = document.createElement('div');
    extra.classList.add('ec-event-title');
    if ( info.event.extendedProps.eventDescription )
    {
        extra.innerHTML = info.event.extendedProps.eventDescription;
    }
        
    return {domNodes: [ title, time, extra ]};
}


const ec = createCalendar(
    // HTML element the calendar will be mounted to
    document.getElementById('calendarContainer'),
    // Array of plugins
    [TimeGrid, DayGrid, TimeGrid, List, Interaction],
    // Options object
    {
        headerToolbar: {
            start: 'prev,next today',
            center: 'title',
            end: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        },
        timeGridWeek: {pointer: true},
        //events: createEvents(),
        //dayMaxEvents: true,
        nowIndicator: true,
        selectable: true,
        unselectAuto: false,
        pointer: true,
        view: 'timeGridWeek',
        unselect: function( info) {
        },
        select: function( info ){ 

            previewEventSetup( info )

        },
        eventClick: function( info ){ 

            onEventClicked( info );

        },
        dateClick: function( info ){ 

            onDateClicked( info );
            console.log( "dateclick" )  

        },
        eventDidMount: function( info ){

        },
        eventContent: function( info ){

            
            return createEventContent( info );

        },
        eventResize: function( info ) {

            onEventresize( info.event  )

        },
        eventDrop: function( info ) {
            
            onEventDropped( info );

        }
        
    }
);
//console.log(ec)





/*
                                                                            Create the event listners for info popover

*/
function setupEventInfoPopOver()
{
    const popEventInfoPopOver = document.querySelector('[data-name="popover-event-details"]');
    popEventInfoPopOver.querySelector('[data-event-action="edit"]').addEventListener('click', (e) => {
        e.preventDefault();
        disposeEventForm();
        //console.log( document.querySelector(`.id-${currentEvent.id}`) )
        //console.log( document.querySelector(`.id-${currentEvent.id}`) )
        calendarEventFormRef = createEventForm( document.querySelector( `.id-${currentEvent.id}` ), 'update', true );
    })
    popEventInfoPopOver.querySelector('[data-event-action="delete"]').addEventListener('click', ( e ) => {
        e.preventDefault();
        disposeEventForm();
        clearcurrentEvent();
    })
    
}



/*
                                                                            Create the event listners for the form elements

*/
function setupEventFormListeners()
{
    //Add event listeners to the form elements
    // Update the title of the event when the user causes the title textbox to loos focus 
    document.querySelector("#eventName").addEventListener('focusout', function( e ){
        const title = document.querySelector("#eventName").value
        if ( title != "" )
        {
            currentEvent.title = title
        } else {
            currentEvent.title = "untitled"
        }
        
        updateEventContent( document.querySelector("#formActionSubmit").attributes.getNamedItem("button-action").value );

    })
    // Upate the title of the event when the user presses enter
    document.querySelector("#eventName").addEventListener('keypress', function( e ){
        if (e.key === "Enter") 
        {
            currentEvent.title =document.querySelector("#eventName").value
            console.log( currentEvent.title )
            updateEventContent( document.querySelector("#formActionSubmit").attributes.getNamedItem("button-action").value )
            //ec.updateEvent( currentEvent );
            //updateEventContent();
            this.blur();
        }
        
        //console.log( this )
    })
    // ON change event for the start time drop down
    document.querySelector("#startTime").addEventListener('change', function( e ){
        const newTime = this.value.split(":")
        newTime.push( "00" );
        //console.log( currentEvent.start )
        //console.log(newTime);
        currentEvent.start.setHours( parseInt(newTime[0]), parseInt(newTime[1]), parseInt(newTime[2]) )
        console.log( currentEvent.start )
        updateEventContent( document.querySelector("#formActionSubmit").attributes.getNamedItem("button-action").value  );
    })
    //On change for the end time drop down
    document.querySelector("#endTime").addEventListener('change', function( e ){
        const newTime = this.value.split(":")
        newTime.push( "00" );
        //console.log( currentEvent.start )
        //console.log(newTime);
        currentEvent.end.setHours( parseInt(newTime[0]), parseInt(newTime[1]), parseInt(newTime[2]) )
        console.log( currentEvent.end )
        updateEventContent( document.querySelector("#formActionSubmit").attributes.getNamedItem("button-action").value  );
    })
    //Listen for colour changes
    const colourChoices =  document.querySelectorAll('input[name="EventColourOptions"]');
    colourChoices.forEach( colorOption => {
        colorOption.addEventListener('change', function() {
            if( this.checked ) {
                console.log( currentEvent )
                currentEvent.backgroundColor = this.value;
                updateEventContent( document.querySelector("#formActionSubmit").attributes.getNamedItem("button-action").value )
            }        
        })
    }) 
    // Listen for the focus out for the event description
    document.querySelector("#EventDescription").addEventListener('focusout', function( e ){
        const EventDescription = document.querySelector("#EventDescription").value
        if ( EventDescription != "" )
        {
            currentEvent.extendedProps = { eventDescription: EventDescription };
            //ec.updateEvent( currentEvent );
        } else {

            currentEvent.extendedProps = { eventDescription: "" };

        }
        
        console.log( currentEvent.extendedProps )
        //ec.updateEvent( currentEvent );

        updateEventContent( document.querySelector("#formActionSubmit").attributes.getNamedItem("button-action").value )
    })
    
    document.querySelector("#formActionSubmit").addEventListener('click', function( e ){
        const formAction = e.target.attributes.getNamedItem("button-action").value 
        console.log( e.target.attributes.getNamedItem("button-action").value )
        if ( formAction == "new" )
        {
            createNewEvent();
        } else if ( formAction == "update" )
        {
            createToast( "Saving changes to event", "Event Updated" );
            updateEvent();
        }
        

    })


}



document.addEventListener("DOMContentLoaded", () => {
    console.log("Hello World!");
    createTimeOptions('startTime', 0, 24, 30 );
    setupEventFormListeners();
    //setupEventInfoPopOver();



    const colourList = document.createElement('ul')
    colourList.classList.add('colour-list')
    eventColoursArray.forEach( colorOption => {
        const colourItem = document.createElement('li');
        colourItem.classList.add('colour-list-item');
        colourItem.innerHTML = `${colorOption.name}`
        colourList.appendChild( colourItem )
    })
   
    //const colourListElement = document.getElementById("event-colour-list").appendChild(colourList)
    // console.log( colourListElement )
  });
  // Example usage: Create options from 8:00 to 17:00 (5 PM) with 15-minute intervals
  



// If you later need to destroy the calendar then use
//destroyCalendar(ec);

/*
                            NOTES

Can I disable the current dropped event until the the changes have saved?
On click brings up form with edit button. Fields are disbabled
On drag or on drop bring up form with update event button

Use the call back functions on the PB site services to enact toast elements for on savem, update and delete complete 

Ok so everything is done in 24px incremenets. So when we update the start time we can take the index number of the dropfown item and multiply by 24 to get the top postion.
For updating the end event time we just need to multipy the height of the element by the difference of the index numbers between the two drop downs and then also update the event end time.

Need to check for the ondrop if the event it outside the end of the day make the event end time equal to midnight
*/