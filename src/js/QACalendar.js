// Import our custom CSS


// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'


import { createCalendar, DayGrid, TimeGrid, List, Interaction } from '@event-calendar/core';
import EventPopOvers from './eventPopOvers'
import QAToast from './QAToast'
//import eventPopOvers from './eventPopOvers'
// Import CSS if your build tool supports it
import '@event-calendar/core/index.css';


let instance = null;
//let calendarEventFormRef = null; // Will be used to reference the create popover
//let isPreviewEvent = false; // Variable used to store if the current event is a preview event.
//let formType = 'popover' // The defualt form type. Can be popover or offcanvas. On mobile devices off canvas will be used.
const eventColoursArray = [
    { name: "cornflowerblue", value: "cornflowerblue" },
    { name: "gold", value: "rgb(246, 191, 38)" },
    { name: "green", value: "mediumaquamarine" },
    { name: "lightcoral", value: "lightcoral" },
    { name: "orange", value: "orange" },
    { name: "purple", value: "orchid" },
    { name: "gray", value: "slategray" }   
]

export default class QACalendar
{
    constructor( canvas )
    {
        if( instance )
        {
            return instance
        }
        instance = this 
        this.canvas = canvas
        this.ecCalendar = this.newCalendar( ) //( info ) => { this.previewEventSetup( info ) }
        this.currentEvent = false;
        this.eventPopOver = new EventPopOvers( eventColoursArray );
        this.QAToasts = new QAToast();
        this.view = "timeGridWeek"
        this.calendarStartTime = "08:00"
        this.calendarEndTime = "20:00"
    }

    newCalendar(  )
    {
        const app = this
        /*const previewEventSetup = ( info ) => { this.previewEventSetup( info ) };
        const onEventResize = ( info ) => { this.onEventResize( info ) };
        const onEventDrop = ( info ) => { this.onEventDrop( info ) };
        const onDateClick = ( info ) => { this.onDateClick( info ) };
        const onEventClick = ( info ) => { this.onEventClick( info ) };
        const renderEventContent = ( info ) => { return this.renderEventContent( info ) };
        const viewHandler = ( info ) => { return this.viewHandler( info ) };*/
        //const calenderStartTime
        const ec = createCalendar(
            // HTML element the calendar will be mounted to
            this.canvas,
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
                slotMinTime: "08:00",
                slotMaxTime: "20:00",
                slotDuration: "00:30",
                slotHeight: 80,
                unselect: function( info) {
                },
                select: function( info ){ 
        
                    app.previewEventSetup( info )
                    //console.log( info )
        
                },
                eventClick: function( info ){ 
        
                    app.onEventClick( info );
        
                },
                dateClick: function( info ){ 
        
                    app.onDateClick( info );
        
                },
                eventDidMount: function( info ){
        
                },
                eventContent: function( info ){
        
                    return app.renderEventContent( info )
        
                },
                eventResize: function( info ) {
        
                    app.onEventResize( info.event  )
        
                },
                eventDrop: function( info ) {
                    
                    
                    const startHour = app.calendarStartTime.split(":")
                    if ( info.event.start.getHours() < parseInt( startHour[0] ) )
                    {                       
                        console.log("revert")
                        info.revert()

                    } else {
                        app.onEventDrop( info );
                    }
        
                },
                viewDidMount: function( info ) {
                    
                    //console.log( "viewDidMoint: ", info );
                    app.viewHandler( info )
        
                }
                
            }
        );

        return ec;
    }

    previewEventSetup( info )
    {

        if ( this.isPreviewEvent )
        {  
            //console.log( "is preview" )
            this.clearcurrentEvent()
        }

        info.title = "untitled"
        info.id = Date.now()
        info.classNames = [ "event-preview", `id-${info.id}` ]
        info.backgroundColor = "cornflowerblue";
        info.extendedProps = { eventDescription: null }
        this.currentEvent = this.ecCalendar.addEvent( info );
        this.ecCalendar.unselect();
        this.isPreviewEvent = true;
        this.eventPopOver.setView( this.ecCalendar.getView() ) //
        this.eventPopOver.setFormAction( "new" )
        //console.log( "view: " , this.ecCalendar.getView() )
        //this.currentEvent.isPreview = true
        //console.log( this.currentEvent )


        setTimeout(() => {
            
            this.eventPopOver.createNewEventPopover( document.querySelector( `.id-${this.currentEvent.id}` ), info, ( info, eventAction, eventChanges ) => { this.formActions( info, eventAction, eventChanges ) } );

        }, 50); 
    }

    clearcurrentEvent()
    {

        this.ecCalendar.removeEventById( this.currentEvent.id )
        this.currentEvent = false;
        this.isPreviewEvent = false
        //console.log(  this.eventPopOver.getPopOver() )
        this.eventPopOver.deletePopOver()
        //console.log(  this.eventPopOver.getPopOver() )

    }

    formActions( info, eventAction, eventChanges )
    {
        
        switch( eventAction ) {
            case "updateContent":
                this.updateEventContent( info )
                break;
            case "updateEvent":
                this.updateEvent( info )
                break;
            case "timeChange":
                this.onTimeChange( info, eventChanges )
                break;
            case "saveEvent":
                this.saveEvent( info )
                this.eventPopOver.deletePopOver()
                break;
            case "saveChanges":
                this.saveChanges( info )
                this.eventPopOver.deletePopOver()
                break;    
            case "creatEditForm":
                this.eventPopOver.deletePopOver()
                this.eventPopOver.setFormAction( "update" )
                this.eventPopOver.createNewEventPopover( document.querySelector( `.id-${info.id}` ), info, ( info, eventAction, eventChanges ) => { this.formActions( info, eventAction, eventChanges ) } );
                break;
            case "deleteEvent":
                this.deleteEvent( info )
                this.eventPopOver.deletePopOver()
                break;
            case "clearcurrentEvent":
                this.clearcurrentEvent()
                this.eventPopOver.deletePopOver()
                break;                                                   
            default:
                break;    
        }

    }

    onDateClick( info )
    {
        console.log("date clicked: ", this.view , info )
        if ( this.isPreviewEvent )
        {
           
            this.clearcurrentEvent() 

        } else {

            console.log("date clicked:  new event" )
            const newEvent = {}

            newEvent.start = new Date(info.date);
            newEvent.end = new Date(info.date);
            
            //if in monthGridVeiw set the start time to the day start
            if ( this.view == "dayGridMonth" )
            {
                const startHour = this.calendarStartTime.split(":")
                console.log( startHour[0] )
                newEvent.start.setHours( newEvent.start.getHours() +  parseInt( startHour[0]) )
                newEvent.end.setHours( newEvent.end.getHours() +  parseInt( startHour[0]) )
                //newEvent.end = newEvent.start
            }

            //newEvent.end.setHours( newEvent.end.getHours() + 1);
            newEvent.end.setMinutes( newEvent.end.getMinutes() + 30);
            this.previewEventSetup( newEvent )
        }
    }

    onEventClick( info )
    {
        console.log("event clicked: ", info.event )
        const isEventPreview = this.checkEventIsPreview( info.event )
        if ( isEventPreview )
        {

        } else {
            if( this.isPreviewEvent )
            {
                this.clearcurrentEvent()
            }
        
            const eventInfo =  info.event 
            console.log( eventInfo )
            this.eventPopOver.deletePopOver()
            this.eventPopOver.creatUpdateEventPopOver( document.querySelector( `.id-${eventInfo.id}` ), eventInfo, ( eventInfo, eventAction, eventChanges ) => { this.formActions( eventInfo, eventAction, eventChanges ) } );  
        
        }
    }




    onEventResize( info )
    {
        console.log("event resise: ", info )
        console.log( "popOver: ", this.eventPopOver.getPopOverType() )
        
        const isEventPreview = this.checkEventIsPreview( info )
        if ( isEventPreview )
        {
            setTimeout(() => {

                this.eventPopOver.deletePopOver()
                this.eventPopOver.createNewEventPopover( document.querySelector( `.id-${info.id}` ), info, ( info, eventAction, eventChanges ) => { this.formActions( info, eventAction, eventChanges ) } );
                this.currentEvent = info;

            }, 50);
        } else {

            if( this.isPreviewEvent ) // If a preview event exists clear that event
            {
                this.clearcurrentEvent()               
            }

             if( this.eventPopOver.getPopOver() )
             {
                  
                 this.eventPopOver.deletePopOver()
                 setTimeout(() => {
                    if ( this.eventPopOver.getPopOverType() == "form")
                    {
                        this.eventPopOver.createNewEventPopover( document.querySelector( `.id-${info.id}` ), info, ( info, eventAction, eventChanges ) => { this.formActions( info, eventAction, eventChanges ) } );
                    } else {
                        this.eventPopOver.creatUpdateEventPopOver( document.querySelector( `.id-${info.id}` ), info, ( info, eventAction ) => { this.formActions( info, eventAction ) } );
                    }
                }, 50);
             }

            this.saveChanges( info )
        }
        

    }
 
    
 // If the event dropped is a preview event then redraw the popOver form
 // If the event dropped is not a preview event then clear the current event which is the preview event   
    onEventDrop( dropinfo )
    {
        const info = dropinfo.event
        /*const startHour = this.calendarStartTime.split(":")
        if ( info.start.getHours() < parseInt( startHour[0] ) )
        {
            
            dropinfo.revert()
            console.log("revert: ", dropinfo.revert )
            console.log( this.ecCalendar )
        }*/

        //console.log("event drop: ", dropinfo )
        const isEventPreview = this.checkEventIsPreview( info )
        //console.log( isEventPreview  )
        if ( isEventPreview )
        {
            setTimeout(() => {

                this.eventPopOver.deletePopOver()
                this.eventPopOver.createNewEventPopover( document.querySelector( `.id-${info.id}` ), info, ( info, eventAction, eventChanges ) => { this.formActions( info, eventAction, eventChanges ) } );
                this.currentEvent = info;

            }, 50);
        } else {

            if( this.isPreviewEvent )
            {
                this.clearcurrentEvent() 
            }

            if( this.eventPopOver.getPopOver() )
            {
                     
                this.eventPopOver.deletePopOver()
                setTimeout(() => {
                    if ( this.eventPopOver.getPopOverType() == "form")
                    {
                        this.eventPopOver.createNewEventPopover( document.querySelector( `.id-${info.id}` ), info, ( info, eventAction, eventChanges ) => { this.formActions( info, eventAction, eventChanges ) } );
                    } else {
                        this.eventPopOver.creatUpdateEventPopOver( document.querySelector( `.id-${info.id}` ), info, ( info, eventAction ) => { this.formActions( info, eventAction ) } );
                    }
                }, 50);   
            }

            this.saveChanges( info )
        }


        //this.updateEvent( info )
    }

    updateEventContent( info )
    {
        this.ecCalendar.updateEvent( info )
        this.currentEvent = info; 
    }




    updateEvent( info )
    {
        
        this.ecCalendar.updateEvent( info )
        const isEventPreview = this.checkEventIsPreview( info )
            
        setTimeout(() => {

            this.eventPopOver.deletePopOver()
            this.eventPopOver.createNewEventPopover( document.querySelector( `.id-${info.id}` ), info, ( info, eventAction, eventChanges ) => { this.formActions( info, eventAction, eventChanges ) } );
            this.currentEvent = info;

        }, 50); 
        
        
        if ( !isEventPreview )
        {    
            this.saveChanges( info )
        }

    }

    saveChanges( info )
    {
        
        this.ecCalendar.updateEvent( info )
        this.QAToasts.createToast( "Saving Changes to event", "Saving changes" );
        setTimeout(() => {

            this.QAToasts.createToast( "Changes to event saved", "Changes Saved" );
    
        }, 1000);  

    }

    saveEvent( info )
    {
        
        console.log( "event saved" )
        info.classNames = [ `id-${info.id}` ]
        this.ecCalendar.updateEvent( info )
        this.currentEvent = null;
        this.isPreviewEvent = false; 
        

        this.QAToasts.createToast( "Saving new event", "Saving new event" );
        setTimeout(() => {
    
            this.QAToasts.createToast( "New event saved", "New event Saved" );
    
        }, 1000); 

    }



    deleteEvent( info )
    {
        console.log( "event deleted" )
        this.ecCalendar.removeEventById( info.id )
        this.currentEvent = null;
        this.isPreviewEvent = false; 
        
        this.QAToasts.createToast( "Deleting event", "Deleting event" );
        setTimeout(() => {
    
            this.QAToasts.createToast( "Event deleted", "Deleting event" );
    
        }, 1000); 

    }





    viewHandler( info )
    {
        this.view = info.type
        this.ecCalendar.refetchEvents()
        
        if( this.isPreviewEvent )
        {
            this.clearcurrentEvent()
            //this.currentEvent = false;
            //this.isPreviewEvent = false       
        } else {
            this.eventPopOver.deletePopOver()
        }
        
    }






    // Creates the format for the event.
    // We changed the default so that the title would come first
    renderEventContent( info )
    {
        if (this.view == "timeGridWeek")
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

    }

    checkEventIsPreview( info )
    {
        const check = info.classNames.find( ( className ) => className == "event-preview")
        if ( check === "event-preview" )
        {
            return true
        } else 
        {
            return false
        }
    }

    /*onTimeChange( info, eventLength )
    {
        console.log("time changed: ", eventLength)
        console.log(info )
        
        //check if the start time is the one that has changed
        //If so add the event lenth to the start time for the event end
    }*/

}

// 2. on Drop,  if event is preview redraw popOver form
//              if event is not preivew but preview event exists delete preview event
//              if event is not preview but has edit popOver redraw popOver     
// 3. If the start time is changed to later than the end time, move the event and add the time difference         