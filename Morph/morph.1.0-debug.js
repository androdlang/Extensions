var MORPH;!function(a){var b=function(){function b(c,d,e,f,g,h,i,j,k){if("undefined"==typeof g&&(g=0),"undefined"==typeof h&&(h=1),"undefined"==typeof i&&(i=null),"undefined"==typeof j&&(j=null),"undefined"==typeof k&&(k=a.Pace.LINEAR),this.shapeKeyGroupName=c,this._referenceStateName=d,this._endStateName=e,this._milliDuration=f,this._millisBefore=g,this._endStateRatio=h,this.movePOV=i,this.rotatePOV=j,this._pace=k,this._startTime=-1,this._currentDurationRatio=b._COMPLETE,this._referenceStateName===this._endStateName)throw"Deformation: reference state cannot be the same as the end state";if(this._milliDuration<=0)throw"Deformation: milliDuration must > 0";if(this._millisBefore<0)throw"Deformation: millisBefore cannot be negative";if(this._endStateRatio<-1||this._endStateRatio>1)throw"Deformation: endStateRatio range  > -1 and < 1";this.shapeKeyGroupName=this.shapeKeyGroupName.toUpperCase(),this._referenceStateName=this._referenceStateName.toUpperCase(),this._endStateName=this._endStateName.toUpperCase(),this.setProratedWallClocks(1)}return b.prototype.activate=function(c){"undefined"==typeof c&&(c=0),this._startTime=a.Mesh.now(),c>0&&(c/=5,this._startTime-=c<this._milliDuration/10?c:this._milliDuration/10),this._currentDurationRatio=this._syncPartner?b._BLOCKED:this._proratedMillisBefore>0?b._WAITING:b._READY},b.prototype.getCompletionMilestone=function(){if(this._currentDurationRatio===b._COMPLETE)return b._COMPLETE;if(this._currentDurationRatio===b._BLOCKED){if(!this._syncPartner.isBlocked())return b._BLOCKED;this._startTime=a.Mesh.now(),this._currentDurationRatio=b._WAITING,this._syncPartner.syncReady(this._startTime)}var c=a.Mesh.now()-this._startTime;if(this._currentDurationRatio===b._WAITING){if(c-=this._proratedMillisBefore,!(c>=0))return b._WAITING;this._startTime=a.Mesh.now()-c}return this._currentDurationRatio=c/this._proratedMilliDuration,this._currentDurationRatio>b._COMPLETE&&(this._currentDurationRatio=b._COMPLETE),this._pace.getCompletionMilestone(this._currentDurationRatio)},b.prototype.resumePlay=function(){this._currentDurationRatio!==b._COMPLETE&&this._currentDurationRatio!==b._BLOCKED&&this._currentDurationRatio!==b._COMPLETE&&(this._startTime=a.Mesh.now()-this._proratedMilliDuration*this._currentDurationRatio)},b.prototype.setSyncPartner=function(a){this._syncPartner=a},b.prototype.syncReady=function(a){this._startTime=a,this._currentDurationRatio=b._WAITING},b.prototype.isBlocked=function(){return this._currentDurationRatio===b._BLOCKED},b.prototype.isComplete=function(){return this._currentDurationRatio===b._COMPLETE},b.prototype.getReferenceStateName=function(){return this._referenceStateName},b.prototype.getEndStateName=function(){return this._endStateName},b.prototype.getMilliDuration=function(){return this._milliDuration},b.prototype.getMillisBefore=function(){return this._millisBefore},b.prototype.getEndStateRatio=function(){return this._endStateRatio},b.prototype.getPace=function(){return this._pace},b.prototype.getSyncPartner=function(){return this._syncPartner},b.prototype.setProratedWallClocks=function(a){this._proratedMilliDuration=this._milliDuration*a,this._proratedMillisBefore=this._millisBefore*a},Object.defineProperty(b,"BLOCKED",{get:function(){return b._BLOCKED},enumerable:!0,configurable:!0}),Object.defineProperty(b,"WAITING",{get:function(){return b._WAITING},enumerable:!0,configurable:!0}),Object.defineProperty(b,"READY",{get:function(){return b._READY},enumerable:!0,configurable:!0}),Object.defineProperty(b,"COMPLETE",{get:function(){return b._COMPLETE},enumerable:!0,configurable:!0}),b._BLOCKED=-20,b._WAITING=-10,b._READY=0,b._COMPLETE=1,b}();a.ReferenceDeformation=b}(MORPH||(MORPH={}));var MORPH;!function(a){var b=function(){function b(a,b,c,d){if(this._mesh=a,this._name=b,this._states=new Array,this._normals=new Array,this._stateNames=new Array,this._queue=new Array,this._currentSeries=null,this._currentStepInSeries=null,this._endOfLastFrameTs=-1,this._reusablePositionFinals=new Array,this._reusableNormalFinals=new Array,this._lastReusablePosUsed=0,this._lastReusableNormUsed=0,this._doingRotation=!1,this._doingMovePOV=!1,this._activeLockedCamera=null,this._mirrorAxis=-1,!(c instanceof Array)||0===c.length)throw"ShapeKeyGroup: invalid affectedPositionElements arg";if(!(d instanceof Array)||d.length!==c.length)throw"ShapeKeyGroup: invalid basisState arg";this._affectedPositionElements=new Uint16Array(c),this._nPosElements=c.length;for(var e=0;e+1<this._nPosElements;e++)if(!(this._affectedPositionElements[e]<this._affectedPositionElements[e+1]))throw"ShapeKeyGroup: affectedPositionElements must be in ascending order";this._reusablePositionFinals.push(new Float32Array(this._nPosElements)),this._reusablePositionFinals.push(new Float32Array(this._nPosElements));for(var h,f=new Array,g=-1,e=0;e<this._nPosElements;e++)h=Math.floor(this._affectedPositionElements[e]/3),g!==h&&(g=h,f.push(g));this._affectedVertices=new Uint16Array(f),this._nVertices=this._affectedVertices.length,this._reusableNormalFinals.push(new Float32Array(3*this._nVertices)),this._reusableNormalFinals.push(new Float32Array(3*this._nVertices)),this.addShapeKey("BASIS",d),this._currFinalPositionVals=this._states[0],this._currFinalNormalVals=this._normals[0]}return b.prototype.getDerivedName=function(a,b,c){return a+"-"+b+"@"+c},b.prototype.addDerivedKeyFromDeformation=function(a){this.addDerivedKey(a.getReferenceStateName(),a.getEndStateName(),a.getEndStateRatio())},b.prototype.addDerivedKey=function(a,b,c){var d=this.getIdxForState(a.toUpperCase()),e=this.getIdxForState(b.toUpperCase());if(-1===d||-1===e)throw"ShapeKeyGroup: invalid source state name(s)";if(1===c)throw"ShapeKeyGroup: deriving a shape key where the endStateRatio is 1 is pointless";var f=this.getDerivedName(d,e,c),g=new Float32Array(this._nPosElements);this.buildPosEndPoint(g,d,e,c),this.addShapeKeyInternal(f,g)},b.prototype.addShapeKey=function(a,b){if(!(b instanceof Array)||b.length!==this._nPosElements)throw"ShapeKeyGroup: invalid stateKey arg";this.addShapeKeyInternal(a,new Float32Array(b))},b.prototype.addShapeKeyInternal=function(a,b){if("string"!=typeof a||0===a.length)throw"ShapeKeyGroup: invalid stateName arg";if(-1!==this.getIdxForState(a))throw"ShapeKeyGroup: stateName "+a+" is a duplicate";this._states.push(b),this._stateNames.push(a);var c=new Float32Array(3*this._nVertices);this.buildNormEndPoint(c,b),this._normals.push(c),this._mesh.debug&&console.log("Shape key: "+a+" added to group: "+this._name+" on MORPH.Mesh: "+this._mesh.name)},b.prototype.incrementallyDeform=function(b,c){if(!(null!==this._currentSeries&&this._currentSeries.hasMoreEvents()||this._nextEventSeries()))return!1;for(;null===this._currentStepInSeries||this._currentStepInSeries.isComplete();){var d=this._currentSeries.nextEvent(this._name);if(null===d)return!1;d instanceof BABYLON.Action?d.execute(BABYLON.ActionEvent.CreateNew(this._mesh)):"function"==typeof d?d.call():this._nextDeformation(d)}var e=this._currentStepInSeries.getCompletionMilestone();if(0>e)return!1;for(var f=0;f<this._nPosElements;f++)b[this._affectedPositionElements[f]]=this._priorFinalPositionVals[f]+(this._currFinalPositionVals[f]-this._priorFinalPositionVals[f])*e;for(var g,h,f=0;f<this._nVertices;f++)g=3*this._affectedVertices[f],h=3*f,c[g]=this._priorFinalNormalVals[h]+(this._currFinalNormalVals[h]-this._priorFinalNormalVals[h])*e,c[g+1]=this._priorFinalNormalVals[h+1]+(this._currFinalNormalVals[h+1]-this._priorFinalNormalVals[h+1])*e,c[g+2]=this._priorFinalNormalVals[h+2]+(this._currFinalNormalVals[h+2]-this._priorFinalNormalVals[h+2])*e;if(this._doingRotation&&(this._mesh.rotation=BABYLON.Vector3.Lerp(this._rotationStartVec,this._rotationEndVec,e)),this._doingMovePOV===!0){if(this._doingRotation){var i=this._fullAmtRight*e-this._amtRightSoFar,j=this._fullAmtUp*e-this._amtUpSoFar,k=this._fullAmtForward*e-this._amtForwardSoFar;this._mesh.movePOV(i,j,k),this._amtRightSoFar+=i,this._amtUpSoFar+=j,this._amtForwardSoFar+=k}else this._mesh.position=BABYLON.Vector3.Lerp(this._positionStartVec,this._positionEndVec,e);null!==this._activeLockedCamera&&this._activeLockedCamera._getViewMatrix()}return this._endOfLastFrameTs=a.Mesh.now(),!0},b.prototype.resumePlay=function(){null!==this._currentStepInSeries&&this._currentStepInSeries.resumePlay()},b.prototype.queueEventSeries=function(a){this._queue.push(a)},b.prototype._nextEventSeries=function(){var a=this._queue.length>0;return a&&(this._currentSeries=this._queue.shift(),this._currentSeries.activate(this._name)),a},b.prototype._nextDeformation=function(b){var c=a.Mesh.now()-this._endOfLastFrameTs;b.activate(1===this._currentSeries.nGroups&&c-this._endOfLastFrameTs<50?c:0),this._currentStepInSeries=b,this._priorFinalPositionVals=this._currFinalPositionVals,this._priorFinalNormalVals=this._currFinalNormalVals;var d=this.getIdxForState(b.getReferenceStateName()),e=this.getIdxForState(b.getEndStateName());if(-1===d||-1===e)throw"ShapeKeyGroup "+this._name+": invalid deformation, source state name(s) not found";var f=b.getEndStateRatio();if(0>f&&-1===this._mirrorAxis)throw"ShapeKeyGroup "+this._name+": invalid deformation, negative end state ratios when not mirroring";if(1===f||0===f)0===f&&(e=d),this._currFinalPositionVals=this._states[e],this._currFinalNormalVals=this._normals[e];else{var g=this.getIdxForState(this.getDerivedName(d,e,f));-1!==g?(this._currFinalPositionVals=this._states[g],this._currFinalNormalVals=this._normals[g]):(this._lastReusablePosUsed=1===this._lastReusablePosUsed?0:1,this.buildPosEndPoint(this._reusablePositionFinals[this._lastReusablePosUsed],d,e,f,this._mesh.debug),this._currFinalPositionVals=this._reusablePositionFinals[this._lastReusablePosUsed],this._lastReusableNormUsed=1===this._lastReusableNormUsed?0:1,this.buildNormEndPoint(this._reusableNormalFinals[this._lastReusableNormUsed],this._currFinalPositionVals),this._currFinalNormalVals=this._reusableNormalFinals[this._lastReusableNormUsed])}if(this._doingRotation=null!==b.rotatePOV,this._doingRotation&&(this._rotationStartVec=this._mesh.rotation,this._rotationEndVec=this._rotationStartVec.add(this._mesh.calcRotatePOV(b.rotatePOV.x,b.rotatePOV.y,b.rotatePOV.z))),this._doingMovePOV=null!==b.movePOV,this._doingMovePOV&&(this._fullAmtRight=b.movePOV.x,this._amtRightSoFar=0,this._fullAmtUp=b.movePOV.y,this._amtUpSoFar=0,this._fullAmtForward=b.movePOV.z,this._amtForwardSoFar=0,this._doingRotation||(this._positionStartVec=this._mesh.position,this._positionEndVec=this._positionStartVec.add(this._mesh.calcMovePOV(this._fullAmtRight,this._fullAmtUp,this._fullAmtForward)))),this._activeLockedCamera=null,this._doingRotation||this._doingMovePOV){var h=this._mesh.getScene().activeCamera;h.lockedTarget&&h.lockedTarget===this._mesh&&(this._activeLockedCamera=h)}},b.prototype.buildPosEndPoint=function(a,b,c,d,e){"undefined"==typeof e&&(e=!1);for(var h,f=this._states[b],g=this._states[c],i=0;i<this._nPosElements;i++)h=(g[i]-f[i])*d,0>d&&this._mirrorAxis!==(i+1)%3&&(h*=-1),a[i]=f[i]+h;e&&console.log(this._name+" end Point built for referenceIdx: "+b+",  endStateIdx: "+c+", endStateRatio: "+d)},b.prototype.buildNormEndPoint=function(a,b){for(var c=new Float32Array(this._mesh.getVerticesData(BABYLON.VertexBuffer.PositionKind)),d=0;d<this._nPosElements;d++)c[this._affectedPositionElements[d]]=b[d];this._mesh.normalsforVerticesInPlace(this._affectedVertices,a,c)},b.prototype.getIdxForState=function(a){for(var b=this._stateNames.length-1;b>=0;b--)if(this._stateNames[b]===a)return b;return-1},b.prototype.getName=function(){return this._name},b.prototype.getNPosElements=function(){return this._nPosElements},b.prototype.getNStates=function(){return this._stateNames.length},b.prototype.toString=function(){return"ShapeKeyGroup: "+this._name+", n position elements: "+this._nPosElements+",\nStates: "+this._stateNames},b.prototype.mirrorAxisOnX=function(){this._mirrorAxis=1},b.prototype.mirrorAxisOnY=function(){this._mirrorAxis=2},b.prototype.mirrorAxisOnZ=function(){this._mirrorAxis=3},b}();a.ShapeKeyGroup=b}(MORPH||(MORPH={}));var __extends=this.__extends||function(a,b){function d(){this.constructor=a}for(var c in b)b.hasOwnProperty(c)&&(a[c]=b[c]);d.prototype=b.prototype,a.prototype=new d},MORPH;!function(a){var b=function(a){function b(b,c,d,e,f,g,h,i){a.call(this,b,"BASIS",c,d,e,f,g,h,i)}return __extends(b,a),b}(a.ReferenceDeformation);a.Deformation=b}(MORPH||(MORPH={}));var MORPH;!function(a){var b=function(){function a(a){this.groupName=a,this._indexInRun=-99,this._highestIndexInRun=-1}return a.prototype.isReady=function(){return-1===this._indexInRun},a.prototype.runComplete=function(){return this._indexInRun>this._highestIndexInRun},a.prototype.activate=function(){this._indexInRun=-1},a}(),c=function(a){function b(b,c,d,e){a.call(this,b,e),this._target=c,this._eSeries=d}return __extends(b,a),b.prototype.execute=function(){this._target.queueEventSeries(this._eSeries)},b}(BABYLON.Action);a.EventSeriesAction=c;var d=function(){function c(c,d,e,f){"undefined"==typeof d&&(d=1),"undefined"==typeof e&&(e=1),"undefined"==typeof f&&(f=!1),this._eventSeries=c,this._nRepeats=d,this._initialWallclockProrating=e,this._debug=f,this._groups=new Array,this._nEvents=c.length;for(var g=0;g<this._nEvents;g++){if(!(this._eventSeries[g]instanceof a.ReferenceDeformation||this._eventSeries[g]instanceof BABYLON.Action||"function"==typeof this._eventSeries[g]))throw"EventSeries:  eventSeries elements must either be a Deformation, Action, or function";if(this._eventSeries[g]instanceof a.ReferenceDeformation){for(var h=this._eventSeries[g].shapeKeyGroupName,i=null,j=this._groups.length-1;j>=0;j--)if(this._groups[j].groupName===h){i=this._groups[j];break}null===i&&(i=new b(h),this._groups.push(i)),i._highestIndexInRun=g}else this._groups.length>0&&(this._groups[0]._highestIndexInRun=g),this._eventSeries[g]instanceof BABYLON.Action&&this._eventSeries[g]._prepare()}if(this.nGroups=this._groups.length,0===this.nGroups)throw"EventSeries: Must have at least 1 Deformation in series.";this._debug&&1===this._nRepeats&&1!==this._initialWallclockProrating&&console.log("EventSeries: clock prorating ignored when # of repeats is 1")}return c.prototype.isShapeKeyGroupParticipating=function(a){for(var b=0;b<this.nGroups;b++)if(this._groups[b].groupName===a)return!0;return!1},c.prototype.activate=function(a){this._everyBodyReady=!0;for(var b=0;b<this.nGroups;b++)this._groups[b].groupName===a?this._groups[b].activate():this._everyBodyReady=this._everyBodyReady&&this._groups[b].isReady();this._debug&&console.log("series activated by "+a+", _everyBodyReady: "+this._everyBodyReady),this._repeatCounter=0,this._proRatingThisRepeat=this._nRepeats>1?this._initialWallclockProrating:1},c.prototype.hasMoreEvents=function(){return this._repeatCounter<this._nRepeats},c.prototype.nextEvent=function(b){if(!this._everyBodyReady)return null;for(var c,d=!1,e=!0,f=0;f<this.nGroups;f++)e=e&&this._groups[f].runComplete(),this._groups[f].groupName===b&&(c=this._groups[f],d=0===f);if(e)if(++this._repeatCounter<this._nRepeats){for(var f=0;f<this.nGroups;f++)this._groups[f].activate();1!==this._initialWallclockProrating&&(this._proRatingThisRepeat=this._initialWallclockProrating+(1-this._initialWallclockProrating)*((this._repeatCounter+1)/this._nRepeats)),this._debug&&console.log("set for repeat # "+this._repeatCounter)}else this._debug&&console.log("Series complete"),this._everyBodyReady=!1;if(c.runComplete())return null;if(c._indexInRun===c._highestIndexInRun)return c._indexInRun++,null;for(var g=c._indexInRun+1;g<this._nEvents;g++)if(this._eventSeries[g]instanceof a.ReferenceDeformation){var h=this._eventSeries[g].shapeKeyGroupName;if(c.groupName===h)return c._indexInRun=g,this._eventSeries[g].setProratedWallClocks(this._proRatingThisRepeat),this._debug&&console.log(g+" in series returned: "+h+", allGroupsRunComplete "+e+", everyBodyReady "+this._everyBodyReady),this._eventSeries[g]}else if(d)return c._indexInRun=g,this._eventSeries[g]},c}();a.EventSeries=d}(MORPH||(MORPH={}));var MORPH;!function(a){var b=function(a){function b(b,c){a.call(this,b,c),this.debug=!1,this._shapeKeyGroups=new Array,this._vertexMemberOfFaces=new Array,this._lastResumeTime=0,this._instancePaused=!1,this._clockStart=-1,this._renderCPU=0,this._totalDeformations=0,this._totalFrames=0,this._definedFacingForward=!0,this._engine=c.getEngine();var d=this;this.registerBeforeRender(function(){d.beforeRender()})}return __extends(b,a),b.prototype.beforeRender=function(){if(null!==this._positions32F&&null!==this._normals32F&&!b._systemPaused&&!this._instancePaused){var c=b.now();if(this._lastResumeTime<b._systemResumeTime){for(var d=this._shapeKeyGroups.length-1;d>=0;d--)this._shapeKeyGroups[d].resumePlay();this._lastResumeTime=b._systemResumeTime}for(var e=!1,d=this._shapeKeyGroups.length-1;d>=0;d--){var f=this._shapeKeyGroups[d].incrementallyDeform(this._positions32F,this._normals32F);e=e||f}e&&(this._clockStart<0&&this._resetTracking(c),a.prototype.updateVerticesDataDirectly.call(this,BABYLON.VertexBuffer.PositionKind,this._positions32F),a.prototype.updateVerticesDataDirectly.call(this,BABYLON.VertexBuffer.NormalKind,this._normals32F),this._renderCPU+=b.now()-c,this._totalDeformations++),this._totalFrames++}},b.prototype.resetTracking=function(){this._resetTracking(b.now())},b.prototype._resetTracking=function(a){this._clockStart=a,this._renderCPU=0,this._totalDeformations=0,this._totalFrames=0},b.prototype.getTrackingReport=function(a){"undefined"==typeof a&&(a=!1);for(var c=b.now()-this._clockStart,d="\nNum Deformations: "+this._totalDeformations+"\nRender CPU milli: "+this._renderCPU.toFixed(2)+"\nRender CPU milli / Deformations: "+(this._renderCPU/this._totalDeformations).toFixed(2)+"\nWallclock milli / Deformations: "+(c/this._totalDeformations).toFixed(2)+"\nMemo, Deformations / Sec: "+(this._totalDeformations/(c/1e3)).toFixed(2)+"\nMemo, Frames with no deformation: "+(this._totalFrames-this._totalDeformations)+"\nMemo, Total vertices: "+this.getTotalVertices()+"\nShape keys:",e=0;e<this._shapeKeyGroups.length;e++)d+="\n"+this._shapeKeyGroups[e].toString();return a&&this.resetTracking(),d},b.prototype.clone=function(){return BABYLON.Tools.Error("Shared vertex instances not supported for MORPH.Mesh"),null},b.prototype.createInstance=function(){return BABYLON.Tools.Error("Shared vertex instances not supported for MORPH.Mesh"),null},b.prototype.convertToFlatShadedMesh=function(){BABYLON.Tools.Error("Flat shading not supported for MORPH.Mesh")},b.prototype.setVerticesData=function(b,c,d){a.prototype.setVerticesData.call(this,b,c,d||b===BABYLON.VertexBuffer.PositionKind||b===BABYLON.VertexBuffer.NormalKind);var e;b===BABYLON.VertexBuffer.PositionKind?(e=this.getVertexBuffer(BABYLON.VertexBuffer.PositionKind),this._positions32F=new Float32Array(e.getData())):b===BABYLON.VertexBuffer.NormalKind&&(e=this.getVertexBuffer(BABYLON.VertexBuffer.NormalKind),this._normals32F=new Float32Array(e.getData()))},b.prototype.setIndices=function(b){a.prototype.setIndices.call(this,b);var d,c=b.length/3,e=a.prototype.getTotalVertices.call(this),f=this.findZeroAreaFaces();f>0&&BABYLON.Tools.Warn("MORPH.Mesh: Zero area faces found:  "+f+", nFaces: "+c+", nVert "+e);for(var g=0;e>g;g++){for(var h=new Array,i=0;c>i;i++)d=3*i,(b[d]===g||b[d+1]===g||b[d+2]===g)&&h.push(i);this._vertexMemberOfFaces.push(h)}},b.prototype.findZeroAreaFaces=function(){for(var f,b=a.prototype.getIndices.call(this),c=b.length/3,d=a.prototype.getVerticesData.call(this,BABYLON.VertexBuffer.PositionKind),e=0,g=BABYLON.Vector3.Zero(),h=BABYLON.Vector3.Zero(),i=BABYLON.Vector3.Zero(),j=0;c>j;j++)f=3*j,BABYLON.Vector3.FromArrayToRef(d,3*b[f],g),BABYLON.Vector3.FromArrayToRef(d,3*b[f+1],h),BABYLON.Vector3.FromArrayToRef(d,3*b[f+2],i),(g.equals(h)||g.equals(i)||h.equals(i))&&e++;return e},b.prototype.normalsforVerticesInPlace=function(b,c,d){for(var g,h,i,j,r,e=a.prototype.getIndices.call(this),f=b.length,k=BABYLON.Vector3.Zero(),l=BABYLON.Vector3.Zero(),m=BABYLON.Vector3.Zero(),n=BABYLON.Vector3.Zero(),o=BABYLON.Vector3.Zero(),p=BABYLON.Vector3.Zero(),q=BABYLON.Vector3.Zero(),s=BABYLON.Vector3.Zero(),t=0;f>t;t++){g=this._vertexMemberOfFaces[b[t]],h=g.length,BABYLON.Vector3.FromFloatsToRef(0,0,0,s);for(var u=0;h>u;u++){if(i=3*g[u],j=this.indexOfVertInFace(e[i],e[i+1],e[i+2],b[t]),-1===j)throw"MORPH.Mesh: vertex not part of face";BABYLON.Vector3.FromFloatArrayToRef(d,3*e[i+j],k),BABYLON.Vector3.FromFloatArrayToRef(d,3*e[i+(j+1)%3],l),BABYLON.Vector3.FromFloatArrayToRef(d,3*e[i+(j+2)%3],m),k.subtractToRef(l,n),m.subtractToRef(l,o),BABYLON.Vector3.CrossToRef(n,o,p),BABYLON.Vector3.NormalizeToRef(p,q),r=p.length()/(n.length()*o.length()),-1>r?r=-1:r>1&&(r=1),q.scaleInPlace(Math.asin(r)),s.addInPlace(q)}s.normalize(),c[3*t]=s.x,c[3*t+1]=s.y,c[3*t+2]=s.z}},b.prototype.indexOfVertInFace=function(a,b,c,d){return d===a?0:d===b?1:d===c?2:-1},b.prototype.addShapeKeyGroup=function(a){this._shapeKeyGroups.push(a)},b.prototype.queueEventSeries=function(a){for(var b=!1,c=this._shapeKeyGroups.length-1;c>=0;c--)a.isShapeKeyGroupParticipating(this._shapeKeyGroups[c].getName())&&(this._shapeKeyGroups[c].queueEventSeries(a),b=!0);this.debug&&!b&&BABYLON.Tools.Warn("no shape keys groups participating in event series")},b.prototype.getShapeKeyGroup=function(a){for(var b=this._shapeKeyGroups.length-1;b>=0;b--)if(this._shapeKeyGroups[b].getName()===a)return this._shapeKeyGroups[b];return null},b.prototype.setDefinedFacingForward=function(a){this._definedFacingForward=a},b.prototype.movePOV=function(a,b,c){this.position.addInPlace(this.calcMovePOV(a,b,c))},b.prototype.calcMovePOV=function(a,b,c){var d=new BABYLON.Matrix,e=this.rotationQuaternion?this.rotationQuaternion:BABYLON.Quaternion.RotationYawPitchRoll(this.rotation.y,this.rotation.x,this.rotation.z);e.toRotationMatrix(d);var f=BABYLON.Vector3.Zero(),g=this._definedFacingForward?-1:1;return BABYLON.Vector3.TransformCoordinatesFromFloatsToRef(a*g,b,c*g,d,f),f},b.prototype.rotatePOV=function(a,b,c){this.rotation.addInPlace(this.calcRotatePOV(a,b,c))},b.prototype.calcRotatePOV=function(a,b,c){var d=this._definedFacingForward?1:-1;return new BABYLON.Vector3(a*d,b,c*d)},b.pauseSystem=function(){b._systemPaused=!0},b.isSystemPaused=function(){return b._systemPaused},b.resumeSystem=function(){b._systemPaused=!1,b._systemResumeTime=b.now()},b.prototype.pausePlay=function(){this._instancePaused=!0},b.prototype.isPaused=function(){return this._instancePaused},b.prototype.resumePlay=function(){this._instancePaused=!1,this._lastResumeTime=b.now();for(var a=this._shapeKeyGroups.length-1;a>=0;a--)this._shapeKeyGroups[a].resumePlay()},b.now=function(){return"undefined"==typeof window.performance?Date.now():window.performance.now()},Object.defineProperty(b,"Version",{get:function(){return"1.0.0"},enumerable:!0,configurable:!0}),b._systemPaused=!1,b._systemResumeTime=0,b}(BABYLON.Mesh);a.Mesh=b}(MORPH||(MORPH={}));var MORPH;!function(a){var b=function(){function a(a,b){if(this.completionRatios=a,this.durationRatios=b,!(a instanceof Array&&b instanceof Array))throw"Pace: ratios not arrays";if(a.length!==b.length)throw"Pace: ratio arrays not of equal length";if(0===a.length)throw"Pace: ratio arrays cannot be empty";for(var c,d,e=-1,f=0;f<a.length;f++){if(c=a[f],d=b[f],0>=c||0>=d)throw"Pace: ratios must be > 0";if(c>1||d>1)throw"Pace: ratios must be <= 1";if(e>=d)throw"Pace: durationRatios must be in increasing order";e=d}if(1!==c||1!==d)throw"Pace: final ratios must be 1";this.steps=a.length,this.incremetalCompletionBetweenSteps=[a[0]],this.incremetalDurationBetweenSteps=[b[0]];for(var f=1;f<this.steps;f++)this.incremetalCompletionBetweenSteps.push(a[f]-a[f-1]),this.incremetalDurationBetweenSteps.push(b[f]-b[f-1]);Object.freeze(this)}return a.prototype.getCompletionMilestone=function(a){if(0>=a)return 0;if(a>=1)return 1;for(var b=0;b<this.steps&&!(a<this.durationRatios[b]);b++);var c=b>0?this.completionRatios[b-1]:0,d=b>0?this.durationRatios[b-1]:0,e=(a-d)/this.incremetalDurationBetweenSteps[b];return c+e*this.incremetalCompletionBetweenSteps[b]},a.LINEAR=new a([1],[1]),a}();a.Pace=b}(MORPH||(MORPH={}));