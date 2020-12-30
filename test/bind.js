(function () {
  if (!("SmartBind" in window)) {
    // never run more than once
    // This hack sets a "proxy" property for HTMLInputElement.value set property
    var nativeHTMLInputElementValue = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    );
    var newDescriptor = Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      "value"
    );
    newDescriptor.set = function (value) {
      if ("settingDomBind" in this) return;
      var hasDataBind = this.hasAttribute("data-bind");
      if (hasDataBind) {
        this.settingDomBind = true;
        var dataBind = this.getAttribute("data-bind");
        if (!this.hasAttribute("data-bind-context-id")) {
          console.error(
            "Impossible to recover data-bind-context-id attribute",
            this,
            dataBind
          );
        } else {
          var bindContextId = this.getAttribute("data-bind-context-id");
          if (bindContextId in SmartBind.contexts) {
            var bindContext = SmartBind.contexts[bindContextId];
            var dataTarget = SmartBind.getDataTarget(bindContext, dataBind);
            SmartBind.setDataValue(dataTarget, value);
          } else {
            console.error(
              "Invalid data-bind-context-id attribute",
              this,
              dataBind,
              bindContextId
            );
          }
        }
        delete this.settingDomBind;
      }
      nativeHTMLInputElementValue.set.bind(this)(value);
    };
    Object.defineProperty(HTMLInputElement.prototype, "value", newDescriptor);

    var uid = function () {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    };

    // SmartBind Functions
    window.SmartBind = {};
    SmartBind.BindContext = function () {
      var _data = {};
      var ctx = {
        id: uid() /* Data Bind Context Id */,
        _data: _data /* Real data object */,
        mapDom: {} /* DOM Mapped objects */,
        mapDataTarget: {} /* Data Mapped objects */,
      };
      SmartBind.contexts[ctx.id] = ctx;
      ctx.data = new Proxy(
        _data,
        SmartBind.getProxyHandler(ctx, "data")
      ); /* Proxy object to _data */
      return ctx;
    };

    SmartBind.getDataTarget = function (bindContext, bindPath) {
      var bindedObject = { bindContext: bindContext, bindPath: bindPath };
      var dataObj = bindContext;
      var dataObjLevels = bindPath.split(".");
      for (var i = 0; i < dataObjLevels.length; i++) {
        if (i == dataObjLevels.length - 1) {
          // last level, set value
          bindedObject = { target: dataObj, item: dataObjLevels[i] };
        } else {
          // digg in
          if (!(dataObjLevels[i] in dataObj)) {
            console.warn(
              "Impossible to get data target object to map bind.",
              bindPath,
              bindContext
            );
            break;
          }
          dataObj = dataObj[dataObjLevels[i]];
        }
      }
      return bindedObject;
    };

    SmartBind.contexts = {};
    SmartBind.add = function (bindContext, domObj) {
      if (typeof domObj == "undefined") {
        console.error("No DOM Object argument given ", bindContext);
        return;
      }
      if (!domObj.hasAttribute("data-bind")) {
        console.warn("Object has no data-bind attribute", domObj);
        return;
      }
      domObj.setAttribute("data-bind-context-id", bindContext.id);
      var bindPath = domObj.getAttribute("data-bind");
      if (bindPath in bindContext.mapDom) {
        bindContext.mapDom[bindPath][
          bindContext.mapDom[bindPath].length
        ] = domObj;
      } else {
        bindContext.mapDom[bindPath] = [domObj];
      }
      var bindTarget = SmartBind.getDataTarget(bindContext, bindPath);
      bindContext.mapDataTarget[bindPath] = bindTarget;
      domObj.addEventListener("input", function () {
        SmartBind.setDataValue(bindTarget, this.value);
      });
      domObj.addEventListener("change", function () {
        SmartBind.setDataValue(bindTarget, this.value);
      });
    };

    SmartBind.setDataValue = function (bindTarget, value) {
      if (!("target" in bindTarget)) {
        var lBindTarget = SmartBind.getDataTarget(
          bindTarget.bindContext,
          bindTarget.bindPath
        );
        if ("target" in lBindTarget) {
          bindTarget.target = lBindTarget.target;
          bindTarget.item = lBindTarget.item;
        } else {
          console.warn(
            "Still can't recover the object to bind",
            bindTarget.bindPath
          );
        }
      }
      if ("target" in bindTarget) {
        bindTarget.target[bindTarget.item] = value;
      }
    };
    SmartBind.getDataValue = function (bindTarget) {
      if (!("target" in bindTarget)) {
        var lBindTarget = SmartBind.getDataTarget(
          bindTarget.bindContext,
          bindTarget.bindPath
        );
        if ("target" in lBindTarget) {
          bindTarget.target = lBindTarget.target;
          bindTarget.item = lBindTarget.item;
        } else {
          console.warn(
            "Still can't recover the object to bind",
            bindTarget.bindPath
          );
        }
      }
      if ("target" in bindTarget) {
        return bindTarget.target[bindTarget.item];
      }
    };
    SmartBind.getProxyHandler = function (bindContext, bindPath) {
      return {
        get: function (target, name) {
          if (name == "__isProxy") return true;
          // just get the value
          // console.debug("proxy get", bindPath, name, target[name]);
          return target[name];
        },
        set: function (target, name, value) {
          target[name] = value;
          bindContext.mapDataTarget[bindPath + "." + name] = value;
          SmartBind.processBindToDom(bindContext, bindPath + "." + name);
          // console.debug("proxy set", bindPath, name, target[name], value );
          // and set all related objects with this target.name
          if (value instanceof Object) {
            if (!(name in target) || !target[name].__isProxy) {
              target[name] = new Proxy(
                value,
                SmartBind.getProxyHandler(bindContext, bindPath + "." + name)
              );
            }
            // run all tree to set proxies when necessary
            var objKeys = Object.keys(value);
            // console.debug("...objkeys",objKeys);
            for (var i = 0; i < objKeys.length; i++) {
              bindContext.mapDataTarget[
                bindPath + "." + name + "." + objKeys[i]
              ] = target[name][objKeys[i]];
              if (
                typeof value[objKeys[i]] == "undefined" ||
                value[objKeys[i]] == null ||
                !(value[objKeys[i]] instanceof Object) ||
                value[objKeys[i]].__isProxy
              )
                continue;
              target[name][objKeys[i]] = new Proxy(
                value[objKeys[i]],
                SmartBind.getProxyHandler(
                  bindContext,
                  bindPath + "." + name + "." + objKeys[i]
                )
              );
            }
            // TODO it can be faster than run all items
            var bindKeys = Object.keys(bindContext.mapDom);
            for (var i = 0; i < bindKeys.length; i++) {
              // console.log("test...", bindKeys[i], " for ", bindPath+"."+name);
              if (bindKeys[i].startsWith(bindPath + "." + name)) {
                // console.log("its ok, lets update dom...", bindKeys[i]);
                SmartBind.processBindToDom(bindContext, bindKeys[i]);
              }
            }
          }
          return true;
        },
      };
    };
    SmartBind.processBindToDom = function (bindContext, bindPath) {
      var domList = bindContext.mapDom[bindPath];
      if (typeof domList != "undefined") {
        try {
          for (var i = 0; i < domList.length; i++) {
            var dataTarget = SmartBind.getDataTarget(bindContext, bindPath);
            if ("target" in dataTarget)
              domList[i].value = dataTarget.target[dataTarget.item];
            else
              console.warn("Could not get data target", bindContext, bindPath);
          }
        } catch (e) {
          console.warn("bind fail", bindPath, bindContext, e);
        }
      }
    };
  }
})();
