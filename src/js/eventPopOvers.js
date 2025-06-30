import * as bootstrap from 'bootstrap'

export default class eventPopOvers 
{
    constructor ( eventColours ) {

        this.eventColoursArray = eventColours;
        this.popOver = null;
        this.calendarView = null; // This will hold that data for which view the calendat is in, the default will be week view. This is changed by the calendar
        this.formAction = "new" // Set it to either new or update. Will change the text of the button
        this.popOverType = ""
        this.startTimes = 8
        this.endTimes = 20
    }

    setPopOverType( data)
    {
        this.popOverType = data
    }

    getPopOverType( )
    {
        return this.popOverType
    }

    setView( data )
    {
        this.calendarView = data
    }

    getView( )
    {
        return this.calendarView
    }

    setFormAction( action )
    {
        this.formAction = action
    }
    
    getFormAction( action )
    {
        return this.formAction
    }


    getPopOver()
    {
        return this.popOver;
    }

    deletePopOver()
    {

        if ( this.popOver )
        {
            this.popOver.dispose();
            this.popOver = null;
        }

    }

    updatePopOver()
    {

        this.popOver.update();

    }

    creatUpdateEventPopOver( popOverTarget, info, callBackFunction ) {
    

        const startTimeString = Intl.DateTimeFormat("en-GB", { hour: 'numeric', hour12: true, minute: "2-digit" }).format(info.start).replace(" ", "")
        const endTimeString = Intl.DateTimeFormat("en-GB", { hour: 'numeric', hour12: true, minute: "2-digit" }).format(info.end).replace(" ", "")
        
        const colourListContainer = document.createElement('ul')
        //colourListContainer.classList.add('flex')
        this.eventColoursArray.forEach( colour => {
            const colourElement = document.createElement('li')
            colourElement.classList.add('item' )
            //colourElement.style.backgroundColor = colour.value
            
            colourListContainer.appendChild( colourElement )
            if ( info.backgroundColor == colour.value )
            {
                colourElement.classList.add('selected' )
                colourElement.innerHTML = `<span style="border-color: ${colour.value}">&nbsp;</span>`;    
            } else {
                colourElement.innerHTML = `<span style="background-color: ${colour.value}">&nbsp;</span>`;
            }
        })
        //console.log( info.backgroundColor, " ", info.extendedProps )
    
        if( info.extendedProps.eventDescription )
        {
            const eventDescription = info.extendedProps.eventDescription;
        } else {
            const eventDescription = "";
        }
         
    
    
        const popOverHTML = document.createElement('div')
        popOverHTML.setAttribute('data-name', 'popover-event-details')
        popOverHTML.classList.add('popOver-content', 'container')
        popOverHTML.innerHTML = `
        <button type="button" class="btn-close" aria-label="Close" id="element-close"></button>
        <div class="row">
                <div class="col flex">
                    <ul class="nav">
                        <li class="nav-item"><a class="nav-link ps-0" data-event-action="edit" href="#" disabled>edit</a></li>
                        <li class="nav-item"><a class="nav-link" data-event-action="delete" href="#" disabled>delete</a></li>
                    </ul>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <h5 class="mb-0" data-name="event-title">${info.title}</h5>
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <span data-name="event-date-time">${Intl.DateTimeFormat("en-GB", { weekday: 'long' }).format(info.start)}, ${Intl.DateTimeFormat("en-GB", { month: 'long' }).format(info.start)} ${Intl.DateTimeFormat("en-GB", { day: 'numeric' }).format(info.start)} <span>⋅</span> ${startTimeString} - ${endTimeString}</span>
                </div>
            </div>
            <div class="row">
                <div class="col colour-List">
                    
                </div>
            </div>
            <div class="row">
                <div class="col">
                    <p data-name="event-description"></p>
                </div>
            </div>
        `
        
        popOverHTML.querySelector('.colour-List').appendChild( colourListContainer)
    
        const calendarPopover = new bootstrap.Popover(popOverTarget, { // Create popover object
            html: true,
            animation: true,
            trigger: 'manual', // Set to manual so that when a user selects anywhere in the calendar we can cancel the preview event and the related popover
            content: popOverHTML,
            toggleEnabled: false
        });
        this.popOverType = "info panel"
        /*----------------------------------------------------------------------------------------------------


                                    Event Listeners for the for popOver


        ----------------------------------------------------------------------------------------------------*/

        popOverHTML.querySelector('[data-event-action="edit"]').addEventListener('click', (e) => {
            
            e.preventDefault();
            callBackFunction( info, "creatEditForm");

        }, { once: true })
    
        popOverHTML.querySelector('[data-event-action="delete"]').addEventListener('click', ( e ) => {
           
            e.preventDefault();
            callBackFunction( info, "deleteEvent");

        } , { once: true })
   
        
        popOverHTML.querySelector('#element-close').addEventListener('click', ( e ) => {
           
            e.preventDefault();
            this.deletePopOver();

        } , { once: true })


        console.log()
    
        this.popOver = calendarPopover;
        calendarPopover.show();
        //console.log( calendarPopover )
        return calendarPopover;
    }



    createNewEventPopover( popOverTarget, info, callBackFunction )
    {
        if( this.popOver )
        {
            this.deletePopOver()
        }
        const popOverHTML = document.createElement('div')
        popOverHTML.setAttribute('data-name', 'popover-event-new-event')
        popOverHTML.classList.add('popOver-content', 'container')
        const innerWrapper = document.createElement('div')
        innerWrapper.classList.add('input-group')
        popOverHTML.appendChild( innerWrapper )


        popOverHTML.innerHTML = `
        <button type="button" class="btn-close" aria-label="Close" id="element-close"></button>
        <div class="row">
                <div class="col"></div>
            </div>            
            <div class="row py-2">
                <div class="col">
                    <label for="eventName" class="form-label">Event Name</label>
                    <input type="text" class="form-control" id="eventName" aria-describedby="Event Name" placeholder="Please enter event name">
                </div>
            </div>
            <div class="row py-2">
                <div class="col">
                    <label for="startDate" class="form-label">Date</label>
                    <input type="date" class="form-control" id="startDate" aria-describedby="Event Date">
                </div>
                <div class="col">
                    <label for="startTime" class="form-label">From</label>
                    <select name="startTime" id="startTime" class="form-select" aria-describedby="Event Start Time" >   
                    </select>
                </div>
                <div class="col">
                    <label for="EndTime" class="form-label">To</label>
                    <select name="EndTime" id="endTime" class="form-select" aria-describedby="Event End Time" >
                    </select>
                </div>
            </div>
            <div class="row py-2" id="colour-options">
            </div>		
            <div class="row py-2">
                <div class="col">
                    <label for="EventDescription" class="form-label">Event Description</label>
                    <textarea class="form-control"  name="EventDescription" id="EventDescription"></textarea>
                </div>
            </div>							
            <div class="row py-2">
                <div class="col">
                    <button class="btn btn-danger" type="submit" id="formActionSubmit">
                        Save event
                    </button>
                </div>
            </div>
        `

        const colourOptions = document.createElement('div')
        colourOptions.classList.add('col')

        const colourOptionsLabel = document.createElement('label')
        colourOptionsLabel.setAttribute('for', 'EventColourOptions')
        colourOptionsLabel.classList.add('form-label', 'w-100')
        colourOptionsLabel.innerHTML = "Event colour"
        colourOptions.appendChild( colourOptionsLabel )

        this.eventColoursArray.forEach( ( colourOption, index )=>{
            const rowElement = document.createElement('div')
            rowElement.classList.add('form-check', 'form-check-inline')
            let checked = ""
            if ( colourOption.value == info.backgroundColor )
            {
                checked = "checked"
                
            }
            rowElement.innerHTML = `<input class="form-check-input eventColourPicker ${colourOption.name}" type="radio" name="EventColourOptions" id="EventColour${index}" value="${colourOption.value}" ${checked} >`
            colourOptions.appendChild( rowElement )
        });

        popOverHTML.querySelector('#colour-options').appendChild( colourOptions )

        popOverHTML.querySelector("#startDate").value = `${info.start.getFullYear()}-${Intl.DateTimeFormat("en-GB", { month: '2-digit' }).format(info.start)}-${Intl.DateTimeFormat("en-GB", { day: '2-digit' }).format(info.start)}`;

        const startTimeElement = popOverHTML.querySelector('#startTime')
        this.createTimeOptions( startTimeElement, this.startTimes, 20, 30 );
        startTimeElement.value = `${Intl.DateTimeFormat("en-GB", { hour: '2-digit' }).format(info.start)}:${Intl.DateTimeFormat("en-GB", { minute: '2-digit' }).format(info.start)}`;

        const endTimeElement = popOverHTML.querySelector('#endTime')
        this.createTimeOptions( endTimeElement, parseInt( Intl.DateTimeFormat("en-GB", { hour: '2-digit' }).format(info.start) ), 24, 30 );
        endTimeElement.remove(0)
        endTimeElement.value = `${Intl.DateTimeFormat("en-GB", { hour: '2-digit' }).format(info.end)}:${Intl.DateTimeFormat("en-GB", { minute: '2-digit' }).format(info.end)}`;
        //console.log( endTimeElement )


        const dateElement = popOverHTML.querySelector('#startDate')
        //console.log ( "start: ", this.calendarView.currentStart , " end: ",  this.calendarView.currentEnd)
        const viewStartDate = `${this.calendarView.currentStart.getFullYear()}-${Intl.DateTimeFormat("en-GB", { month: '2-digit' }).format(this.calendarView.currentStart)}-${this.calendarView.currentStart.getDate()}`
        const viewEndDate = `${this.calendarView.currentEnd.getFullYear()}-${Intl.DateTimeFormat("en-GB", { month: '2-digit' }).format(this.calendarView.currentEnd)}-${( this.calendarView.currentEnd.getDate() - 1)}`
        dateElement.setAttribute( 'min', viewStartDate )
        dateElement.setAttribute( 'max', viewEndDate )
        //console.log( viewStartDate )

        const buttonElement = popOverHTML.querySelector('#formActionSubmit')
        if( this.formAction == "new")
        {
            buttonElement.textContent = "Save New Event"
            buttonElement.setAttribute('button-action', 'new');

        } else
        {
            buttonElement.textContent = "Update Event"
            buttonElement.setAttribute('button-action', 'update');
        }

        /*----------------------------------------------------------------------------------------------------


                                    Event Listeners for the for popOver form


        ----------------------------------------------------------------------------------------------------*/
        
        /*popOverHTML.querySelector('#element-close').addEventListener('click', ( e ) => {
           
            e.preventDefault();
            this.deletePopOver();
            if ( this.formAction == "new" )
            {
                callBackFunction( info, "deleteEvent" )
            }

        } , { once: true })*/

        popOverHTML.querySelector("#eventName").addEventListener('focusout', function( e ){
            const title = popOverHTML.querySelector("#eventName").value
            console.log( "title change: ")
            if ( title != "" )
            {
                info.title = title
            } else {
                info.title = "(no title)"
            }
            callBackFunction( info, "updateContent" )
        })
        popOverHTML.querySelector("#eventName").addEventListener('keypress', function( e ){
            if (e.key === "Enter") 
            {
                const title = popOverHTML.querySelector("#eventName").value
                console.log( "title change: ")
                if ( title != "" )
                {
                    info.title = title
                } else {
                    info.title = "(no title)"
                }
                callBackFunction( info, "updateContent" )
                this.blur();
            }
        })

        //Date change
        popOverHTML.querySelector("#startDate").addEventListener('change', function( e ){
            console.log( "date change: ", this.value)
            const dateValue = this.value.split("-")

            info.start.setYear( parseInt( dateValue[0] ) )
            info.start.setDate( parseInt( dateValue[2] ))
            info.start.setMonth( parseInt( dateValue[1] ) - 1 )

            info.end.setYear( parseInt( dateValue[0] ) )
            info.end.setDate( parseInt( dateValue[2] ))
            info.end.setMonth( parseInt( dateValue[1] ) - 1 )

            callBackFunction( info, "updateEvent" )
        })


        //On change for the end time drop down
        popOverHTML.querySelector("#startTime").addEventListener('change', function( e ){
            const newTime = this.value.split(":")
            newTime.push( "00" );
            //const deltaTime = ( info.end - info.start ) /3600000 // Calculate the length of the event
            //console.log( deltaTime  )
            let newStartTime = new Date( info.start )
            newStartTime.setHours( parseInt(newTime[0]), parseInt(newTime[1]) )
            console.log( newStartTime, "  ",info.start )
            const deltaTime = ( info.end - newStartTime ) /3600000 // Calculate the length of the new event length
            console.log( deltaTime  )
            
            info.start.setHours( parseInt(newTime[0]), parseInt(newTime[1]), parseInt(newTime[2]) )
            if( deltaTime <= 0 )
            {
                info.end.setHours( info.start.getHours(), info.start.getMinutes() + 30, 0 )
                console.log( "set new end time: ", info.end )
            }
            /*const deltaTime = ( info.end - info.start ) /3600000 // Calculate the length of the vent
            const deltaHours = parseInt(deltaTime, 10) // Get the number of hours
            const deltaMinutes = ( deltaTime % 1 ) // Get the number of minutes
            if ( ( deltaTime % 1 ) > 0)

            console.log( deltaTime, "  ", deltaHours, "  ",  deltaMinutes, " ", parseInt(newTime[1]) )*/
            
            



            //info.end.setHours( parseInt(newTime[0]) + deltaTime,  )
            //const newEndTime = String(deltaTime).split(".")
            //const newEndHour = info.start.getHours() + parseInt(newEndTime[0])
            
            //info.end.setHours( info.start.getHours() + deltaTime )
            //console.log( endMinutes )
            //updateEventContent( document.querySelector("#formActionSubmit").attributes.getNamedItem("button-action").value  );
            callBackFunction( info, "updateEvent")
        })
        //On change for the end time drop down
        popOverHTML.querySelector("#endTime").addEventListener('change', function( e ){
            const newTime = this.value.split(":")
            newTime.push( "00" );
            info.end.setHours( parseInt(newTime[0]), parseInt(newTime[1]), parseInt(newTime[2]) )
            //info.log( currentEvent.end )
            //updateEventContent( document.querySelector("#formActionSubmit").attributes.getNamedItem("button-action").value  );
            callBackFunction( info, "updateEvent" )
        })


        //Listen for colour changes
        const colourChoices =  popOverHTML.querySelectorAll('input[name="EventColourOptions"]');
        colourChoices.forEach( colorOption => {
            colorOption.addEventListener('change', function() {
                if( this.checked ) {
                    //console.log( currentEvent )
                    info.backgroundColor = this.value;
                    callBackFunction( info, "updateContent" )
                }        
            })
        }) 


        // Listen for the focus out for the event description
        popOverHTML.querySelector("#EventDescription").addEventListener('focusout', function( e ){
            const EventDescription = popOverHTML.querySelector("#EventDescription").value
            if ( EventDescription != "" )
            {
                info.extendedProps = { eventDescription: EventDescription };
                //ec.updateEvent( currentEvent );
            } else {

                info.extendedProps = { eventDescription: "" };

            }
            
            callBackFunction( info, "updateContent" )
        })


        //                      Listen for the submit button
        popOverHTML.querySelector("#formActionSubmit").addEventListener('click', function( e ){
            e.preventDefault();
            
            console.log(this.getAttribute('button-action'))

            if(this.getAttribute('button-action') == "new" )
            {
                
                callBackFunction( info, "saveEvent" )

            } else {

                callBackFunction( info, "saveChanges" )

            }


        })


        popOverHTML.querySelector('#element-close').addEventListener('click', ( e ) => {
           
            e.preventDefault();
            
            console.log( info )
            if ( this.formAction == "new" )
            {
                callBackFunction( info, "clearcurrentEvent" )
            } else {
                this.deletePopOver();
            }
            

        } , { once: true })



        const calendarPopover = new bootstrap.Popover(popOverTarget, { // Create popover object
            html: true,
            animation: true,
            trigger: 'manual', // Set to manual so that when a user selects anywhere in the calendar we can cancel the preview event and the related popover
            content: popOverHTML,
            toggleEnabled: false
        });
    
        this.popOver = calendarPopover;
        this.popOverType = "form"

        calendarPopover.show();
        return calendarPopover;

    }




    createTimeOptions( targetElement, startHour, endHour, intervalMinutes) {
        if ( targetElement ){
            //const selectElement = document.getElementById(targetElement);
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
                targetElement.add(option);
              }
            }
        }
    }


}

