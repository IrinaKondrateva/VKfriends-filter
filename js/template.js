const friendTemplateHbs = `
    <li class="friends__item" {{#unless selected}}draggable="true"{{/unless}}>
        <div class="friends__photo-wrapper">
            <img class="friends__photo" src="{{photo_50}}" draggable="false" alt="{{first_name}} {{last_name}}">
        </div>
        <div class="friends__name">{{first_name}} {{last_name}}</div>
        {{#if selected}}
        <a class="friends__remove" href="" data-id="{{id}}">
            <svg class="close__svg close__svg_grey">
                <use xlink:href="/img/cross.svg#cross"></use>
            </svg>
        </a>
        {{else}}
        <a class="friends__add" href="" data-id="{{id}}">
            <svg class="close__svg close__svg_grey close__svg_rotate">
                <use xlink:href="/img/cross.svg#cross"></use>
            </svg>
        </a>
        {{/if}}
    </li>`;

const friendTemplate = Handlebars.compile(friendTemplateHbs);

export { friendTemplate };
