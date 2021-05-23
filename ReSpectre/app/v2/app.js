contentData = {
    "Components" : {
        "Accordions" : {
            title:"Accordions", subtitle: "Accordions are used to toggle sections of content.",
            description: "/*\r\nconstructor(isSingleOpen = false, useArrow = true)\r\nupdate data format: [[title, htmlComponent], [title, htmlComponent], ... ]\
            \r\ndata type: isSingleOpen(boolean), useArrow(true), title(string), htmlComponent(object)\
            \r\nisSingleOpen - if true work like radio button else as a checkbox\
            \r\nuseArrow - if true an arrow is used before the title\r\n*/",
            script:"function accordion(){let item = new Accordions(true, true); item.update([[\"Elements\", el(\"ul\", el(\"li\", \"Element 1\"), el(\"li\", \"Element 2\"))], [\"Components\", el(\"ul\", el(\"li\", \"Component 1\"), el(\"li\", \"Component 2\"))]]);return item};accordion()",
            codeContent: "let accordion = new Accordion(true, true)\r\naccordion.update([Title, Child])"
            },
        "Avatars" : {
            title:"Avatars", subtitle: "Avatars are user profile pictures.",
            description: "/*\r\nconstructor()\r\nupdate data format: {src:\"\",\r\n      size:\"\",\r\n      background:\"\",\r\n      altData\"\",\r\n      type:\"\",\r\n      iconSrc(only for type 1):\"\",\r\n      presence(only for type 2): \"\"}\
            \r\ndata types: src(string), size(int)[0,1,2,3,4], background(string), altData(string), type(int)[0,1,2], iconSrc(string), presence(string)[online,away,busy\
            \r\nsize: 0-xs, 1-sm, 2-normal, 3-lg, 4-xl\
            \r\ntype: 0-basic avatar, 1-avatar with icon, 2-avatar with presence\r\n*/",
            example:"<figure class=\"avatar mr-2 .\" data-initial=\"\"><img alt=\"\" src=\"../../img/avatar-1.png\"></figure> \
            <figure class=\"avatar mr-2 avatar-lg\" data-initial=\"\"><img alt=\"\" src=\"../../img/avatar-1.png\"><img src=\"../../img/avatar-1.png\" class=\" avatar-icon\"></figure> \
            <figure class=\"avatar mr-2 avatar-xl\" data-initial=\"\"><img alt=\"\" src=\"../../img/avatar-1.png\"><i class=\" avatar-presence online\"></i></figure>",
            codeContent: "let avatar1 = new Avatar()\r\navatar1.update({src:\"./img/avatar-1.png\", size: 0, background:\"\", altData:\"YZ\", type:0}) \
             \r\n\r\nlet avatar2 = new Avatar()\r\navatar2.update({src:\"./img/avatar-1.png\", size: 1, background:\"\", altData:\"YZ\", type:1,iconSrc:\"./img/avatar-1.png\"}) \
             \r\n\r\nlet avatar2 = new Avatar()\r\navatar2.update({src:\"./img/avatar-1.png\", size: 2, background:\"\", altData:\"YZ\", type:2,presence:\"online\"})"
            },
        "Bars" : {
            title:"Bars", subtitle: "Bars represent the progress of a task or the value within the known range.",
            description: "/*\r\nconstructor(isSmall)\r\nupdate data format: [[width, content, background, tootltip],[width, content, background, tootltip], ... ]\
            \r\ndata types: isSmall(Boolean), width(string%), content(string), background(string), tooltip(string)\
            \r\nisSmall: thin bar is generated if true without content\r\n*/",
            example:"<div class=\"bar\"><div class=\"bar-item tooltip\" data-tooltip=\"area 1\" style=\"width: 25%;\">25%</div><div class=\"bar-item tooltip\" data-tooltip=\"area 2\" style=\"width: 50%; background: rgb(32, 135, 174);\">50%</div></div> \
            <br><div class=\"bar bar-sm\"><div class=\"bar-item tooltip\" data-tooltip=\"small bar\" style=\"width: 50%;\"></div></div>",
            codeContent: "let bar1 = new Bar(false)\r\nbar1.update([[\"25%\",\"25%\",\"\",\"area 1\"], [\"50%\",\"50%\",\"#2087ae\",\"area 2\"]]) \
         \r\n\r\nlet bar2 = new Bar(true)\r\nbar2.update([[\"50%\",\"50%\",\"\",\"small bar\"]])"
        },
        "Breadcrumbs" : {
            title:"BreadCrumbs", subtitle: "Breadcrumbs are used as navigational hierarchies to indicate current location.",
            description: "/*\r\nconstructor(notifyFn, id)\r\nupdate data format: [location, location, ... ]\r\ndata types: notifyFn(function), id(string), location(string)\r\ncallback: notifyFn is called with parameters id and value of element clicked\r\n*/",
            example:"<ul class=\"breadcrumb\"><li class=\" breadcrumb-item\"><a href=\"#\">Home</a></li><li class=\" breadcrumb-item\"><a href=\"#\">Settings</a></li><li class=\" breadcrumb-item\"><a href=\"#\">Change Avatar</a></li></ul>",
            codeContent: "let breadcrumb = new Breadcrumb(notifyFn, id)\r\nbreadcrumb.update([\"Home\", \"Settings\", \"Change Avatar\"])"
        },
        "Cards" : {
            title:"Cards", subtitle: "Cards are flexible content containers.",
            description: "/*\r\nconstructor()\r\nupdate data format: {imgSrc:\"\", title:\"\", subtitle:\"\", body:\"\", footer:object, order:array}\
            \r\ndata type: imgSrc(string), title(string), subtitle(string), body(string), footer(htmlComponent), order(int array)\
            \r\norder: Used to definer order of sections in cards. 0-img, 1-header,2-body, 3-footer\r\n*/",
            example:"<div class=\"columns\"><div class=\"column col-3 col-md-6 col-sm-12\"><div class=\"card\"><img class=\"img-responsive\" src=\"../../img/card-image.jpg\"> \
            <div class=\"card-header\"><div class=\"card-title h5\">Google</div><div class=\"card-subtitle text-gray\">Software and hardware</div>\
            </div><div class=\"card-body\">Organize the world’s information and make it universally accessible and useful.</div>\
            <div class=\"card-footer\"><button class=\"btn btn-primary\">Search</button></div></div></div><div class=\"column col-3 col-md-6 col-sm-12\">\
            <div class=\"card\"><div class=\"card-header\"><div class=\"card-title h5\">Google</div><div class=\"card-subtitle text-gray\">Software and hardware</div></div>\
            <img class=\"img-responsive\" src=\"../../img/card-image.jpg\"><div class=\"card-body\">Organize the world’s information and make it universally accessible and useful.</div>\
            <div class=\"card-footer\"><button class=\"btn btn-primary\">Search</button></div></div></div><div class=\"column col-3 col-md-6 col-sm-12\"><div class=\"card\"><div class=\"card-header\"><div class=\"card-title h5\">Google</div><div class=\"card-subtitle text-gray\">Software and hardware</div></div><div class=\"card-body\">Organize the world’s information and make it universally accessible and useful.</div><img class=\"img-responsive\" src=\"../../img/card-image.jpg\"></div></div><div class=\"column col-3 col-md-6 col-sm-12\"><div class=\"card\"><div class=\"card-header\"><div class=\"card-title h5\">Google</div><div class=\"card-subtitle text-gray\">Software and hardware</div></div><div class=\"card-body\">Organize the world’s information and make it universally accessible and useful.</div><div class=\"card-footer\"><button class=\"btn btn-primary\">Search</button></div></div></div></div>",
            codeContent: "new Card()\r\ncard.update({imgSrc:\"./img/card-image.jpg\",\r\n  title: \"Google\",\r\n  subtitle:\"Software and hardware\",\r\n  body:\"Organize the world’s information and make it universally accessible and useful.\",\r\n  footer: el(\"button.btn.btn-primary\", \"Search\"),\r\n  order:[0,1,2,3]})"
        },
        "Chips" : {
            title:"Chips", subtitle: "Chips are complex entities in small blocks.",
            description: "/*\r\nconstructor()\r\nupdate data format: (htmlComponent)\r\n*/",
            example:"<div><span class=\"chip\"><span>Crime</span></span><span class=\"chip\"><span>Biography<a class=\"btn btn-clear\" href=\"#\" aria-label=\"Close\" role=\"button\"></a></span></span><span class=\"chip\"><img class=\"avatar avatar-sm\" src=\"../../img/avatar-1.png\"><span>Steve Rogers</span><a class=\"btn btn-clear\" href=\"#\" aria-label=\"Close\" role=\"button\"></a></span></div>",
            codeContent: "let chip1 = new Chips()\r\nchip1.update(el(\"span\", \"Crime\")) \
         \r\n\r\nlet chip2 = new Chips()\r\nchip2.update([el(\"img.avatar.avatar-sm\", {src:\"./img/avatar-1.png\"}),el(\"span\", \"Steve Rogers\"), el(\"a.btn.btn-clear\", {href:\"#\", \"aria-label\":\"Close\", role:\"button\"})]]))"
        },
        "Empty States" : {
            title:"Empty States", subtitle: "Empty states/blank slates are commonly used as placeholders for first time use, empty data and error screens.",
            description: "/*\r\nconstructor()\r\nupdate data format: {icon:\"\", title:\"\", subtitle:\"\", action}\
            \r\ndata type: icon(string)[{css class}], title(string), subtitle(string), action(htmlComponent)\r\n*/",
            example:"<div class=\"empty\"><div class=\"empty-icon\"><i class=\"icon icon-3x icon-people\"></i><p class=\"empty-title h5\">You have no new messages</p><p class=\"empty-subtitle\">Click the button to start a Conversation</p><div class=\"empty-action\"><button class=\"btn btn-primary\">Send a message</button></div></div></div>",
            codeContent: "let empty = new Empty()\r\nempty.update({icon:\"icon-people\",\r\n  title:\"You have no new messages\",\r\n  subtitle:\"Click the button to start a Conversation\",\r\n  action: el(\"button.btn.btn-primary\", \"Send a message\")})"
        },
        "Menu" : {
            title:"Menu", subtitle: "Menus are list of links or buttons for actions and navigation.",
            description: "/*\r\nconstructor(type, isVertical = true, id, notifyFn)\
            \r\nupdate data format: (itemList, activeIndex)\
            \r\ndata type: type(int)[0,1,2], isVertical(boolean), id(string), notifyFn(function), itemList(string array), activeIndex(int or int array)\
            \r\ncallback: notifyFn called with id, value of element clicked and activeIndex\
            \r\ntype: 0-string items, 1-checkbox, 2-radio button\
            \r\nactiveIndex: contains the index of current active item(type 0 or 2) or array of indices with value 1 for active (type 1)\r\n*/",
            example:"<div class=\"columns\"><div class=\"column col-6\"><ul class=\"menu\"><li class=\"menu-item\"><a>test</a></li><li class=\"menu-item\"><a class=\"active\">trial</a></li></ul></div><div class=\"column col-6\"><div class=\"menu\"><span class=\"menu-item\" style=\"display: inline-block !important;\"><a>test</a></span><span class=\"menu-item\" style=\"display: inline-block !important;\"><a class=\"active\">trial</a></span></div></div><div class=\"column col-6\"><ul class=\"menu\"><li class=\"menu-item\"><label class=\"form-checkbox\"><input type=\"checkbox\" checked><i class=\"form-icon\"></i><span>test</span></label> \
            </li><li class=\"menu-item\"><label class=\"form-checkbox\"><input type=\"checkbox\" checked><i class=\"form-icon\"></i><span>trial</span></label></li></ul></div><div class=\"column col-6\"><div class=\"menu\"><span class=\"menu-item\" style=\"display: inline-block !important;\"><label class=\"form-checkbox\"><input type=\"checkbox\"><i class=\"form-icon\"></i><span>test</span></label></span><span class=\"menu-item\" style=\"display: inline-block !important;\"><label class=\"form-checkbox\"><input type=\"checkbox\"><i class=\"form-icon\"></i><span>trial</span></label></span></div></div><div class=\"column col-6\"><ul class=\"menu\"> \
            <li class=\"menu-item\"><label class=\"form-radio\"><input type=\"radio\" name=\"null\" checked><i class=\"form-icon\"></i><span>test</span></label></li><li class=\"menu-item\"><label class=\"form-radio\"><input type=\"radio\" name=\"null\"><i class=\"form-icon\"></i><span>trial</span></label></li></ul></div><div class=\"column col-6\"><div class=\"menu\"><span class=\"menu-item\" style=\"display: inline-block !important;\"><label class=\"form-radio\"><input type=\"radio\" name=\"2\"><i class=\"form-icon\"></i><span>test</span></label></span><span class=\"menu-item\" style=\"display: inline-block !important;\"><label class=\"form-radio\"> \
            <input type=\"radio\" name=\"2\"><i class=\"form-icon\"></i><span>trial</span></label></span></div></div></div>",
            codeContent: "let menu = new Menu(0, true, id, notifyFn)\r\nmenu.update([test, trial],1)"
        },
        "Modals" : {
            title:"Modals", subtitle: "Modals are flexible dialog prompts.",
            description: "/*\r\nconstructor()\r\nupdate data format: {button:\"\", title:\"\", body:object, footer:object, size:\"\"}\
            \r\ndata type: button(string), titel(strinbg), body(htmlComponent), footer(htmlComponent), size(int)[0,1,2]\
            \r\nsize: 0-small, 1-normal, 2-large\r\n*/",
            script:"function modalfunc(){let modal1= new Modal(); \
            modal1.update({button:\"Small Modal\", title:\"Modal Title\", body:el(\"p\", \"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, dictum in vehicula sit amet, feugiat tempus tellus. Duis quis sodales risus. Etiam euismod ornare consequat.\"), footer: el(\"button.btn.btn-primary\", \"Share\"), size: 0}); \
            let modal2= new Modal(); \
            modal2.update({button:\"Normal Modal\", title:\"Modal Title\", body:el(\"p\", \"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, dictum in vehicula sit amet, feugiat tempus tellus. Duis quis sodales risus. Etiam euismod ornare consequat.\"), footer: el(\"button.btn.btn-primary\", \"Share\"), size: 1}); \
            let modal3= new Modal(); \
            modal3.update({button:\"Large Modal\", title:\"Modal Title\", body:el(\"p\", \"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, dictum in vehicula sit amet, feugiat tempus tellus. Duis quis sodales risus. Etiam euismod ornare consequat.\"), footer: el(\"button.btn.btn-primary\", \"Share\"), size: 2}); \
            let modal = el(\"div\", modal1, modal2, modal3);return modal};modalfunc()",
            codeContent: "let modal = new Modal()\r\nmodal.update({button:\"Small Modal\",\r\n  title:\"Modal Title\",\r\n  body:el(\"p\", text....),\r\n  footer: el(\"button.btn.btn-primary\", \"Share\"),\r\n  size: 0})"
        },
        "Pagination" : {
            title:"Pagination", subtitle: "Used to Navigate between pages.",
            description: "/*\r\nconstructor(notifyFn, id)\r\nupdate data format: [[content, state], [content, state] ... ]\
            \r\ndata type: content(string), state(string)[active, disabled, \"\"]\r\n*/",
            example:"<ul class=\"pagination\"><li class=\"page-item disabled\"><a href=\"#\">prev</a></li><li class=\"page-item active\"><a href=\"#\">1</a></li><li class=\"page-item\"><a href=\"#\">2</a></li><li class=\"page-item\"><a href=\"#\">3</a></li><li class=\"page-item disabled\"><a href=\"#\">...</a></li><li class=\"page-item\"><a href=\"#\">9</a></li><li class=\"page-item\"><a href=\"#\">Next</a></li></ul>\
            <ul class=\"pagination\"><li class=\"page-item\"><a href=\"#\">prev</a></li><li class=\"page-item\"><a href=\"#\">1</a></li><li class=\"page-item disabled\"><a href=\"#\">...</a></li><li class=\"page-item\"><a href=\"#\">4</a></li><li class=\"page-item active\"><a href=\"#\">5</a></li><li class=\"page-item\"><a href=\"#\">6</a></li><li class=\"page-item disabled\"><a href=\"#\">...</a></li><li class=\"page-item\"><a href=\"#\">9</a></li><li class=\"page-item\"><a href=\"#\">Next</a></li></ul>",
            codeContent: "let pagination = new Pagination([notifyFn, id]) \
         \r\npagination.update([[\"prev\", \"disabled\"], [\"1\",\"active\"],[\"2\",\"\"],[\"3\",\"\"],[\"...\",\"disabled\"],[\"9\",\"\"],[\"Next\",\"\"]])"
        },
        "Panels" : {
            title:"Panel", subtitle: "Panels are flexible view container with auto-expand content section.",
            description: "/*\r\nconstructor()\r\nupdate data format: {header:object, nav:object, body:object,footer:object}\
            \r\ndata type: header(htmlComponent), nav(htmlComponent), body(htmlComponent), footer(htmlComponent)\r\n*/",
            example:"<div class=\"panel\"><div class=\"panel-header\"><h5>Comments</h5></div><div class=\"panel-nav\"><ul class=\"tab tab-block\"><li class=\"tab-item active\"><a>Music</a></li><li class=\"tab-item\"><a>Playlists</a></li><li class=\"tab-item\"><a class=\"badge\" data-badge=\"9\">store</a></li></ul></div><div class=\"panel-body\"><span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, dictum in vehicula sit amet, feugiat tempus tellus. Duis quis sodales risus. Etiam euismod ornare consequat.</span></div><div class=\"panel-footer\"><button class=\"btn btn-primary\">share</button></div></div>",
            codeContent: "let panel = new Panel()\r\nlet tabs = new Tabs(test, \"tabnav\")\r\nthis.tabs1.update([[\"Music\",true],[\"Playlists\",false],[\"store\",true,true,\"9\"]])\r\npanel.update({header: el(\"h5\", \"Comments\"),\r\n  nav : tabs,\r\n  body:  el(\"span\", placeholderText),\r\n  footer : el(\"button.btn.btn-primary\", \"share\")})"
        },
        "Popovers" : {
            title:"Popovers", subtitle: "Popovers are small overlay content containers.",
            description: "/*\r\nconstructor()\r\nupdate data format: {content:\"\", direction:\"\", child: object}\
            \r\ndata type: content(string), direction(string)[top, left, right, bottom], child(htmlComponent)\r\n*/",
            example: "<div class=\"columns\"><div class=\"column col-3\"><div class=\"popover popover-right\"><button class=\"btn btn-primary\">Right</button><div class=\"popover-container\"><div class=\"card\"><img class=\"img-responsive\" src=\"../../img/card-image.jpg\"><div class=\"card-header\"><div class=\"card-title h5\">Google</div><div class=\"card-subtitle text-gray\">Software and hardware</div></div><div class=\"card-body\">Organize the world’s information and make it universally accessible and useful.</div><div class=\"card-footer\"><button class=\"btn btn-primary\">Search</button></div></div></div></div></div><div class=\"column col-3\"><div class=\"popover popover-top\"><button class=\"btn btn-primary\">Top </button><div class=\"popover-container\"><div class=\"card\"><img class=\"img-responsive\" src=\"../../img/card-image.jpg\"><div class=\"card-header\"><div class=\"card-title h5\">Google</div><div class=\"card-subtitle text-gray\">Software and hardware</div></div><div class=\"card-body\">Organize the world’s information and make it universally accessible and useful.</div><div class=\"card-footer\"><button class=\"btn btn-primary\">Search</button></div></div></div></div></div><div class=\"column col-3\"><div class=\"popover popover-bottom\"><button class=\"btn btn-primary\">Bottom</button><div class=\"popover-container\"><div class=\"card\"><img class=\"img-responsive\" src=\"../../img/card-image.jpg\"><div class=\"card-header\"><div class=\"card-title h5\">Google</div><div class=\"card-subtitle text-gray\">Software and hardware</div></div><div class=\"card-body\">Organize the world’s information and make it universally accessible and useful.</div><div class=\"card-footer\"><button class=\"btn btn-primary\">Search</button></div></div></div></div></div><div class=\"column col-3\"><div class=\"popover popover-left\"><button class=\"btn btn-primary\">Left</button><div class=\"popover-container\"><div class=\"card\"><img class=\"img-responsive\" src=\"../../img/card-image.jpg\"><div class=\"card-header\"><div class=\"card-title h5\">Google</div><div class=\"card-subtitle text-gray\">Software and hardware</div></div><div class=\"card-body\">Organize the world’s information and make it universally accessible and useful.</div><div class=\"card-footer\"><button class=\"btn btn-primary\">Search</button></div></div></div></div></div></div>",
            codeContent: "let popover = new Popover()\r\nlet popoverCard = new Card() \
         \r\npopoverCard.update({imgSrc:\"./img/card-image.jpg\",\r\n  title: \"Google\",\r\n  subtitle:\"Software and hardware\",\r\n  body:\"Organize the world’s information and make it universally accessible and useful.\",\r\n  footer: el(\"button.btn.btn-primary\", \"Search\"),\r\n  order:[0,1,2,3]}) \
         \r\npopover.update({content: \"Right popover\", direction: \"right\", child: this.popoverCard1})"
        },
        "Steps" : {
            title:"Steps", subtitle: "Steps are progress indicators of a sequence of task steps.",
            description: "/*\r\nconstructor()\r\nupdate data format: [[content, tooltip],[content, tooltip] ... ]\r\ndata types: content(string), tooltip(string)\r\n*/",
            example:"<ul class=\"step\"><li class=\"step-item\"><a class=\"tooltip\" href=\"#\" data-tooltip=\"Step 1\">Step 1</a></li><li class=\"step-item\"><a class=\"tooltip\" href=\"#\" data-tooltip=\"Step 2\">Step 2</a></li><li class=\"step-item active\"><a class=\"tooltip\" href=\"#\" data-tooltip=\"Step 3\">Step 3</a></li><li class=\"step-item\"><a class=\"tooltip\" href=\"#\" data-tooltip=\"Step 4\">Step 4</a></li></ul>\
            <ul class=\"step\"><li class=\"step-item\"><a class=\"tooltip\" href=\"#\" data-tooltip=\"Step 1\">Step 1</a></li><li class=\"step-item active\"><a class=\"tooltip\" href=\"#\" data-tooltip=\"Step 2\">Step 2</a></li><li class=\"step-item\"><a class=\"tooltip\" href=\"#\" data-tooltip=\"Step 3\">Step 3</a></li><li class=\"step-item\"><a class=\"tooltip\" href=\"#\" data-tooltip=\"Step 4\">Step 4</a></li></ul>",
            codeContent: "let steps = new Steps()\r\nsteps.update([\"Step 1\", \"Step 1\"],[\"Step 2\", \"Step 2\"],[\"Step 3\", \"Step 3\"],[\"Step 4\", \"Step 4\"],)"
        },
        "Tabs" : {
            title:"Tabs", subtitle:"Tabs enable quick switch between different views.",
            description: "/*\r\nconstructor(notifyFn, id)\r\nupdate data format: [[content, isActive, hasBadge, badgeData], [content, state, hasBadge, badgeData], ... ]\
            \r\ndata type: notifyFn(function), id(string), content(string), isActve(Boolean), hasBadge(boolean), badgeData(string)\
            \r\ncallback: notifyFn is called with id and index value of clicked element*/",
            example:"<div class=\"column col-6 col-md-12 col-mx-auto\"><ul class=\"tab tab-block\"><li class=\"tab-item active\"><a>Music</a></li><li class=\"tab-item\"><a>Playlists</a></li><li class=\"tab-item\"><a class=\"badge\" data-badge=\"9\">store</a></li></ul></div>",
            codeContent:"let tabs = new Tabs(notifyFn, id)\r\ntabs.update([[\"Music\",true],[\"Playlists\",false],[\"store\",false,true,\"9\"]])"
        },
        "Tiles" : {
            title:"Tiles", subtitle: "Tiles are repeatable or embeddable information blocks.",
            description: "/*\r\nconstructor(isCompact, hasImage)\r\nupdate data format: {title:\"\", subtitle:\"\", action: object, src(if hasImage):\"\", icon(if !hasImage):\"\"}\
            \r\ndata type: isCompact(boolean), hasImage(boolean), title(string), subtitle(string), action(htmlComponent), src(string), icon(string)[{css class}])\r\n*/",
            example:"<div><div class=\"tile\"><div class=\"tile-icon\"><figure class=\"avatar avatar lg\"><img src=\"../../img/avatar-1.png\"></figure></div><div class=\"tile-content\"><p class=\"tile-title\">The Avengers</p><p class=\"tile-subtitle\">Earth's Mightiest Heroes joined forces to take on thre...</p></div><div class=\"tile-action\"><button class=\"btn btn-primary\">Join</button></div></div><div class=\"tile tile-centered\"><div class=\"tile-icon\"><div class=\"example-tile-icon\"><i class=\"icon p-centered icon-mail\"></i></div></div><div class=\"tile-content\"><p class=\"tile-title\">spectre-docs.pdf</p><small class=\"tile-subtitle text-gray\">14MB · Public · 1 Jan, 2017</small></div><div class=\"tile-action\"><button class=\"btn btn-link\"><i class=\"icon icon-more-vert\"></i></button></div></div></div>",
            codeContent: "let tile = new Tile(false, true)\r\ntile.update({title:\"The Avengers\", subtitle:\"Earth's Mightiest Heroes joined forces to take on thre...\", action: el(\"button.btn.btn-primary\", \"Join\"), src:\"./img/avatar-1.png\"})"
        },
        "Toasts" : {
            title:"Toasts", subtitle: "Toasts are used to show alert or information to users.",
            description: "/*\r\nconstructor()\r\nupdate data format: [htmlComponent, level]\r\ndata types: level(string)[primary, success, error, warning]\r\n*/",
            example:"<div><div class=\"toast toast-success\"><span>Toast success</span></div><div class=\"toast toast-error\"><span>Toast error</span></div><div class=\"toast toast-warning\"><span>Toast warning</span></div><div class=\"toast toast-primary\"><span>Toast primary</span></div></div>",
            codeContent: "let toast = new Toast()\r\ntoast.update([el(\"span\", \"Toast success\"), \"success\"])"
        },
    }
}

class NavMenu {
    constructor(notifyFn) {
        this.notifyFn = notifyFn
        this.title = el("h2")
        this.secondaryText = el("small.label.label-secondary.text-bold")
        this.logo 
        //this.nav = new Accordions(true, false)
        this.nav = new Menu(0, true, "navMenu", this.onChildEvent.bind(this))
        this.brand = el("div.docs-brand", el("div.docs-logo", this.logo, this.title, this.secondaryText))
        this.el = el("div.docs-sidebar.off-canvas-sidebar.active" ,{id:"sidebar"}, this.brand, el("div.docs-nav",this.nav))
    }
    update(data) {
        this.title.textContent = data.title 
        this.secondaryText.textContent = data.subTitle
        this.nav.update(data.navData, 0)
    }
    onChildEvent(id, val, active) {
        console.log(id, val)
        this.notifyFn("navMenu", val)
    }
}

class Content {
    constructor(template) {
        this.template = template
        this.el = el("div.off-canvas-content", this.template)
    }
    update(data) {
        this.template.update(data)
    }
}

class Template {
    constructor() {
        this.title = el("h3.s-title")
        this.subtitle = el("p")
        this.example = el("div")
        this.description = el("p", {style:"white-space: pre;color:#bcc3ce;font-weight:bold"})
        this.codeContent = el("p", {style:"white-space: pre"})
        this.code = el("pre.code", {"data-lang":"JavaScript"}, el("code", this.description, this.codeContent))
        this.el = el("div.docs-content", el("div.container", this.title, this.subtitle, this.example, this.code))
    }
    update(data) {
        this.title.textContent = data.title
        this.subtitle.textContent = data.subtitle
        this.codeContent.textContent = data.codeContent
        this.description.textContent = data.description
        if (data.script) {
            setChildren(this.example, [eval(data.script)])
        }
        else {
            this.example.innerHTML = data.example
        }
    }
}

class App {
    constructor() {
        this.navMenu =  new NavMenu(this.onChildEvent.bind(this))
        let navData = Object.keys(contentData["Components"])
        this.navMenu.update({title:"ReSpectre", subTitle:"DOCS", navData:navData})
        this.template = new Template()
        this.content =  new Content(this.template)
        this.menuToggle = el("a.off-canvas-toggle.btn.btn-primary.btn-action", {onclick:function(){this.navMenu.el.classList.add("active")}.bind(this)}, el("i.icon.icon-menu"))
        this.overlay =  el("a.off-canvas-overlay", {"href": "#close",onclick:function(){this.navMenu.el.classList.remove("active")}.bind(this)})
        this.el = el("div.docs-container.off-canvas.off-canvas-sidebar-show", el("div.docs-navbar", this.menuToggle),
             this.navMenu, this.overlay, this.content)
    }
    onChildEvent(event, data) {
        switch(event) {
            case "navMenu":
                this.content.update(contentData["Components"][data])
                this.navMenu.el.classList.remove("active")
                break
        }
    }
}

let app = new App()
app.content.update(contentData["Components"]["Accordions"])
mount(document.body, app)