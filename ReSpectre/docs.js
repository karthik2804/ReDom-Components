let avatarDoc = el("div", 
    el("p", "Avatars are user profile pictures. There are 3 different options for avatars (Basic avatar, Avatar icons, Avatar Presence)"),
    el("p", "The options available for avatar"),
    el('ul',
        el('li', "src -used to specify the avatar image source"),
        el('li', "size - number with range of 0-4 (0-xs, 1-sm, 2-normal, 3-lg, 4-xg) "),
        el('li', "background - specify the background color"),
        el('li', "altData - text to be displayed if avatar is unavailable"),
        el('li', "type - number between 0-2 used to specify  types of avatar (0-basic, 1-icon, 2-presence)"),
        el('li', "iconSrc - used to specify the avatar icon source for type 1"),
        el('li', "presence  - used to specify the presence status for type 2 (values - online, busy, away, offline)")
    )
)

let breadcrumbDoc = el("div",
    el("p", "Breadcrumbs are used as navigational hierarchies to indicate current location."),
    el("p", "Initialize with ID and function to call for events"),
    el("p", "Update with a array having the navigation path as strings"),
)


let barDoc = el("div",
    el("p", "Bars represent the progress of a task or the value within the known range. Also provides multibar"),
    el("P", "Has 2 types (normal and small). constructor(isSmall) to determine the type"),
    el("P", "It can contain multiple bars."),
    el("p", "Uses an array of array to update it"),
    el("p", "order of array for a bar is [width%, text, background, tooltip text]")     
)

let cardDoc = el("div",
    el("p", "Cards are flexible content containers"),
    el("p", "contains a 4 sections image, header, body and footer"),
    el("p", "The different options are"),
    el("ul",
        el("li", "imgSrc - source for the image, empty for no image"),
        el("li", "title - title of the card"),
        el("li", "subtitle - specify a string for subtitle"),
        el("li", "body - contains the string for the body"),
        el("li", "footer - takes in a html component and can include action buttons"),
        el("li", "order - an array in the order according to which sections are arranged in the card (0-image, 1-header, 2-body, 3-footer). An example is [0,1,2,3] or [1,0,2]. Does not need to be an array of length 4.  ")
    )
)

let chipsDoc = el("div",
    el("p", "Chips are complex entities in small blocks."),
    el("p", "Update with a html component to become a child of the chip")

)

let emptyDoc = el("div",
    el("p", "Empty states/blank slates are commonly used as placeholders for first time use, empty data and error screens"),
    el("p", "options include"),
    el("ul", 
        el("li", "icon - the icon to be used specified in spectre"),
        el("li", "title - title of the block"),
        el("li", "subtitle - subtitle of the block"),
        el("li", "action - used to specify a html component to provide action buttons and such ")
    )
)

let paginationDoc = el("div",
    el("p","Used to Navigate between pages"),
    el("p", "Initiate with ID and function to call on action"),
    el("p", "Update with an array or arry containing each elemtent and its state ( disabled, active or empty) [['Prev', 'disabled'],['1', 'active']['2', '']]")
)

let popoverDoc = el("div", 
    el("p", "Popovers are small overlay content containers"),
    el("p", "The options are"),
    el("ul", 
        el("li", "content - the text on the button"),
        el("li", "direction - direction of popover (top, bottom, left, right"),
        el("li", "child- the html component that is to  pop")
    )
)

let stepsDoc = el("div", 
    el("p", "Steps are progress indicators of a sequence of task steps"),
    el("p", "provide an array of arrays conatining [name, tooltip]")
)


let tileDoc =el("div", 
    el("p", "Tiles are repeatable or embeddable information blocks"),
    el("p", "Has two types (normal and compact"),
    el("p", "Uses a contructor(isCompact, hasImage)"),
    el("p", "Has different section (tile-icon, tile-title, tile-subtitle, tile-action"),
    el("p", "Different options are"),
    el("ul", 
        el("li", "title - the title"),
        el("li", "subtitle - the subtitle"),
        el("li", "icon - image or css icon classname to use"),
        el("li", "action - allows definging custom html component for actions")
    )
)

let toastDoc = el("div",
    el("p", "Toasts are used to show alert or information to users"),
    el("p", "updated using array of [html element, level]. levels are primary, success, warning, error")
)

let modalDoc = el("div", 
    el("p", "Modals are flexible dialog prompts"), 
    el("p", "The different options are"),
    el("ul",
        el("li", "button - text on the button used to open modal"),    
        el("li", "title - title of the modal container"),    
        el("li", "body - html component"),    
        el("li", "footer - html component"),
        el("li", "size - range of 0-2 (0-small, 1-normal, 2-large"),    
    )
)

let tabDoc = el("div",
    el("p", "Tabs enable quick switch between different views"),
    el("p", "Update using array [text, status(active), hasBadge (optional), badgeValue(optional)]")
)

let accordionDoc = el("div", 
    el("p", "Accordions are used to toggle sections of content"),
    el("p", "Update using an array [Title, html component in body]")
)

let panelDoc = el("div", 
    el("p", "Panels are flexible view container with auto-expand content section."),
    el("p", "Update using with html component for each of header, nav, body and footer options")
)

let menuDoc = el("div", 
    el("p", "Menus are list of links or buttons for actions and navigation"),
    el("p", "uses contructor(type, isVertical, id, notifyFn)" ),
    el("p", "types: 0-text, 1-checkbox, 2-radio"),
    el("p", "update using array of string ")
)
