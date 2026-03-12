import { Component } from '@angular/core';

@Component({
selector:'ui-avatar',
standalone:true,
template:`<div class="avatar"><ng-content/></div>`
})
export class AvatarComponent{}
