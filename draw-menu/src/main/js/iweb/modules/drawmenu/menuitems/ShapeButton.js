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
define(["iweb/CoreModule", "./ShapeController"], function(Core) { //Add shape options
	
	return Ext.define(null, {
	       extend: 'Ext.SplitButton',
	       
	       controller: "drawmenu.shapebutton",
	              
			cls: 'shape-btn',
			scale: 'medium',
			arrowAlign: 'bottom',
			menuAlign: 't-b?',
			
			listeners: {
				toggle: "onToggle"
			},
			
			menu: {
				cls: 'shape-menu',
				minWidth: 0,
				plain: true,

				referenceHolder: true,
				
				layout: {
			        type: 'vbox'
			    },
				
				defaults: {
					xtype: 'button',
					scale: 'medium',
					margin: 0,
					toggleGroup: 'shapeMenuGroup',
					allowDepress: false
				},
				items: [{
					tooltip: "Draw Vector Polygon",
					icon: "images/drawmenu/line-polygon.png",
					reference: "vectorPolygon",
					handler: "onVectorPolygonClick"
				},{
					tooltip: "Draw Circle",
					icon: "images/drawmenu/circle-icon-01.png",
					reference: "circle",
					handler: "onCircleClick"
				},{
					tooltip: "Draw Triangle",
					icon: "images/drawmenu/triangle-icon-01.png",
					reference: "triangle",
					handler: "onTriangleClick"
				},{
					tooltip: "Draw Square",
					icon: "images/drawmenu/square-icon-01.png",
					reference: "square",
					handler: "onSquareClick"
				},{
					tooltip: "Draw Hexagon",
					icon: "images/drawmenu/hexagon-icon-01.png",
					reference: "hexagon",
					handler: "onHexagonClick"
				}]
			}
	       
	    });
});
