/*
 * Copyright (c) 2008-2015, Massachusetts Institute of Technology (MIT)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
define(["iweb/CoreModule", "./FireLineController"], function(Core) {

	return Ext.define(null, {
	       extend: 'Ext.SplitButton',
	       
	       controller: "drawmenu.firelinebutton",
	       
	        cls: 'fire-line-btn',
			scale: 'medium',
			arrowAlign: 'bottom',
			menuAlign: 't-b?',
			colspan: 2,

			style: { width: '100%'},
			
			listeners: {
				toggle: "onToggle"
			},
			
			menu: {
				cls: 'fire-line-menu',
				minWidth: 0,
				plain: true,

				referenceHolder: true,
				
				layout: {type: 'vbox', align: 'stretch'},
				
				defaults: {
					xtype: 'button',
					scale: 'medium',
					margin: 0,
					toggleGroup: 'fireLineMenuGroup',
					allowDepress: false,
					iconAlign: 'left',
					textAlign: 'left'
				},
				items: [{
					text: "Planned Fire Line",
					tooltip: "Planned Fire Line",
					icon: "images/drawmenu/planned-fire-line.png",
					reference: "planned",
					handler: "onPlannedClick"
				},{
					text: "Secondary Fire Line",
					tooltip: "Secondary Fire Line",
					icon: "images/drawmenu/secondary-fire-line.png",
					reference: "secondary",
					handler: "onSecondaryClick"
				},{
					text: "Completed Fire Line",
					tooltip: "Completed Fire Line",
					icon: "images/drawmenu/completed-fire-line.png",
					reference: "completedFire",
					handler: "onCompletedFireClick"
				},{
					text: "Fire Spread Prediction",
					tooltip: "Fire Spread Prediction",
					icon: "images/drawmenu/fire-spread-prediction.png",
					reference: "spread",
					handler: "onSpreadClick"
				},{
					text: "Management Action Point",
					tooltip: "Management Action Point",
					icon: "images/drawmenu/management-action-point.png",
					reference: "actionPoint",
					handler: "onActionPointClick"
				},{
					text: "Completed Dozer Line",
					tooltip: "Completed Dozer Line",
					icon: "images/drawmenu/completed-dozer-line.png",
					reference: "completedDozer",
					handler: "onCompletedDozerClick",
					hidden: true
				},{
					text: "Proposed Dozer Line",
					tooltip: "Proposed Dozer Line",
					icon: "images/drawmenu/proposed-dozer-line.png",
					reference: "proposedDozer",
					handler: "onProposedDozerClick",
					hidden: true
				},{
					text: "Uncontrolled Fire Edge Line",
					tooltip: "Uncontrolled Fire Edge Line",
					icon: "images/drawmenu/fire-edge-line.png",
					reference: "fireEdge",
					handler: "onFireEdgeClick",
					hidden: true
				}]
			}
	       
	    });
});
