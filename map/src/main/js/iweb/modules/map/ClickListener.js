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
define(['ext', 'iweb/CoreModule'], function(Ext, Core){

	return Ext.define('map.ClickListener', {

		constructor: function(renderers) {
			this.renderers = renderers;
			this.activeFeature = null;
			this.activeFeatures = null;

			this.container = new Ext.window.Window({
				title: 'Feature Details',
				width: 400,
				componentCls:'form-feature-detail',
				renderTo: "cMainComponent-body",
				closeAction: 'hide',
				listeners: {
					close: this.onWindowClose,
					scope: this
				},
				tbar: [{
					itemId: 'previous',
					text: 'Previous',
					iconCls: Ext.baseCSSPrefix + 'tbar-page-prev',
					handler: "onPreviousClicked",
					scope: this,
					flex: 1
				},"->",{
					itemId: 'next',
					text: 'Next',
					iconCls: Ext.baseCSSPrefix + 'tbar-page-next',
					iconAlign: 'right',
					handler: "onNextClicked",
					scope: this,
					flex: 1
				}]
			});

			//we listen to the select event so we get click details
			this.olMap = Core.Ext.Map.getMap();
			this.olMap.on("moveend", this.onMapMoveEnd, this);

			var select = Core.Ext.Map.getSelectInteraction();
			select.on("select", this.onMapViewSelect.bind(this));

			Core.EventManager.addListener("map-source-set", this.onMapSourceSet.bind(this));

			this.bufferedRender = Ext.Function.createBuffered(this.render, 100, this);
		},

		addRenderer: function(renderer) {
			this.renderers.push(renderer);
		},

		onWindowClose: function() {
			this.cleanup();
		},

		onMapViewSelect: function(evt) {
			this.lastClickCoord = evt.mapBrowserEvent.coordinate;
			var px = this.olMap.getPixelFromCoordinate(this.lastClickCoord);
			var features = evt.selected;

			var handled = false;
			if (features.length) {
				this.activeFeature = features[0];

				//get any other clicked features
				var clickedFeatures = this.getFeaturesAtPixel(px);
				if (clickedFeatures.length > 1) {
					this.activeFeatures = clickedFeatures;

					//show/enable toolbar
					this.container.getDockedItems()[1].show();
				} else {
					//hide/disable toolbar
					this.container.getDockedItems()[1].hide();
				}

				this.container.show();
				this.container.setLocalXY(px);

				handled = this.render(this.activeFeature);
			}else{
				Core.EventManager.fireEvent("iweb.map.view.select", evt, this.container);
			}

			if (!handled) {
				this.cleanup();
			}
		},

		onPreviousClicked: function() {
			var idx = this.activeFeatures.indexOf(this.activeFeature);
			var newIdx = (idx - 1);
			if (newIdx < 0) {
				newIdx = (this.activeFeatures.length - 1);
			}

			this.activeFeature = this.activeFeatures[newIdx];
			this.render(this.activeFeature);

			select.getFeatures().clear();
			select.getFeatures().push(this.activeFeature);
		},

		onNextClicked: function() {
			var idx = this.activeFeatures.indexOf(this.activeFeature);
			var newIdx = (idx + 1) % this.activeFeatures.length;

			this.activeFeature = this.activeFeatures[newIdx];
			this.render(this.activeFeature);

			select.getFeatures().clear();
			select.getFeatures().push(this.activeFeature);
		},

		onMapSourceSet: function(eventName, oldSource, source) {
			this.unlistenToSource(oldSource);

			//clear the overlay on source change (i.e. change rooms)
			this.cleanup();

			this.listenToSource(source);
		},

		listenToSource: function(source) {
			if(source){
				source.on('removefeature', this.onRemoveFeature, this);
				source.on('changefeature', this.onChangeFeature, this);
			}
		},

		unlistenToSource: function(source) {
			if(source){
				source.un('removefeature', this.onRemoveFeature, this);
				source.un('changefeature', this.onChangeFeature, this);
			}
		},

		cleanup: function() {
			//setting position undefined hides the overlay
			this.container.hide();
			this.container.removeAll();
			this.activeFeature = null;
			this.activeFeatures = null;
		},

		onRemoveFeature: function(event) {
			if (this.activeFeatures) {
				var idx = this.activeFeatures.indexOf(this.activeFeature);
				if (idx >= 0) {
					this.cleanup();
					return;
				}
			}
			
			if (event.feature == this.activeFeature) {
				this.cleanup();
			}
		},

		onChangeFeature: function(event) {
			if (event.feature == this.activeFeature) {
				this.bufferedRender(this.activeFeature);


				this.lastClickCoord = event.feature.getGeometry()
					.getClosestPoint(this.container.getXY());
				this.container.setLocalXY(
					this.olMap.getPixelFromCoordinate(this.lastClickCoord));
			}
		},

		onMapMoveEnd: function() {
			if (this.activeFeature) {
				this.container.setLocalXY(
					this.olMap.getPixelFromCoordinate(this.lastClickCoord));
			}
		},

		render: function(feature) {
			//clear the container before rendering
			this.container.removeAll();

			return this.delegateRender(this.container, feature);
		},

		delegateRender: function(container, feature) {
			return this.renderers.reduce(function(prev, curr, idx, arr){
				return curr.render.call(curr, container, feature) || prev;
			}, false);
		},

		getFeaturesAtPixel: function(px) {
			var features = [];
			this.olMap.forEachFeatureAtPixel(px, function(feature, layer){
				features.push(feature);
			});
			return features;
		}

	});

});
