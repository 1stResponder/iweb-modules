/*
 * Copyright (c) 2008-2016, Massachusetts Institute of Technology (MIT)
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
define(["iweb/CoreModule", "./MarkersDefs"],
        function(Core, MarkersDefs) {

	return Ext.define(null, {
	       extend: 'Ext.Window',
			
			cls: 'marker-window',
			title: 'Markers',
			bodyCls: 'marker-window',
			closeAction: 'hide',
			shadow: false,
			renderTo: Ext.getBody(),
			layout: 'fit',

			x: 155,
			y: 175,	
			
			minWidth: 225,
			width: 445,

			minHeight: 150,
			height: 225,
			
			listeners: {
				click: function(event){
					
					var target = event.target;
					this.component.fireEvent('marker-clicked',
						target.attributes['src'].value, //img
						target.height, //height
						target.width, //width
						target.attributes['data-qtip'].value //description
					);
				},
				element: 'el',
				delegate: 'img',
				scope: "self"
			},
			
			
			initComponent: function(defs) {
		        Ext.apply(this, {
		            items: this.buildTabPanel(defs)
		        });
				
				this.callParent(arguments);
			},
			
			buildTabPanel: function(defs) {
				return {
			        xtype: "tabpanel",
			        activeTab: 0,
                    
				items: this.buildMarkerTabs(defs)
				}
			},
			
			buildMarkerTabs: function() {
				var tabs = Object.keys(MarkersDefs).map(function(key){
					var value = MarkersDefs[key];
					return this.buildMarkerTab(key, value);
				}, this);
				return tabs;
			},
			
			buildMarkerTab: function(name, items) {
				return {
					title: name,
					autoScroll: true,

					layoutConfig: {
						columns: 14,
						tableAttrs: {
							cls: 'x-table-layout marker-table',
							style: {
								width: '100%'
							}
						}
					},

					defaults: {
						cellCls: 'marker-cell'
					},

					items: this.buildMarkers(items)
				};
			},
			
			buildMarkers: function(definitions) {
				return definitions.map(this.buildMarker);
			},
			
			buildMarker: function(item) {
				return {
					xtype: 'container',
					autoEl: {
						tag: 'span'
					},

					items: {
						xtype: 'box',
						autoEl: {
							tag: 'img',
							src: item.img,
							'data-qtip': item.label
						}
					}
				};
			}
	       
	    });
});
