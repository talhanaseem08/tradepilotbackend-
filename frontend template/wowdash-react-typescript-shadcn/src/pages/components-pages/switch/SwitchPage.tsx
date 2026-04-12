import LazyWrapper from "@/components/LazyWrapper"
import DefaultCardComponent from "@/components/shared/DefaultCardComponent"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import Breadcrumb from "@/layouts/Breadcrumb"
import React from "react"

/* ================= REDUCER ================= */

type State = {
  [key: string]: boolean
}

type Action = {
  type: "TOGGLE"
  key: string
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "TOGGLE":
      return {
        ...state,
        [action.key]: !state[action.key],
      }
    default:
      return state
  }
}

/* ================= INITIAL STATE ================= */

const initialState: State = {
  switch1: true,
  switch2: true,
  switch3: true,
  switch4: true,

  inactiveSwitch1: false,
  inactiveSwitch2: false,
  inactiveSwitch3: false,
  inactiveSwitch4: false,

  switchTwo1: true,
  switchTwo2: true,
  switchTwo3: true,
  switchTwo4: true,

  inactiveSwitchTwo1: false,
  inactiveSwitchTwo2: false,
  inactiveSwitchTwo3: false,
  inactiveSwitchTwo4: false,

  switchWithText1: false,
  switchWithText2: false,

  inactiveSwitchHorizonta1: false,
  inactiveSwitchHorizonta2: false,
  inactiveSwitchHorizonta3: false,
  inactiveSwitchHorizonta4: false,
}

/* ================= COMPONENT ================= */

const SwitchPage = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState)

  const toggle = (key: string) =>
    dispatch({ type: "TOGGLE", key })

  return (
    <>
      <Breadcrumb title="Switch" text="Switch" />

      <LazyWrapper>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ================= DEFAULT SWITCH ================= */}
          <DefaultCardComponent title="Default Switch">
            <div className="flex flex-wrap gap-8">

              <div className="flex flex-wrap gap-6">
                {[
                  ["switch1", "text-primary", "bg-primary"],
                  ["switch2", "text-purple-600", "bg-purple-600"],
                  ["switch3", "text-green-600", "bg-green-600"],
                  ["switch4", "text-yellow-500", "bg-yellow-500"],
                ].map(([key, textColor, bg]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={key}
                      checked={state[key]}
                      onCheckedChange={() => toggle(key)}
                      className={`!bg-[#9ca3af] !data-[state=checked]:${bg}`}
                    />
                    <Label
                      htmlFor={key}
                      className={state[key] ? `${textColor} font-medium` : ""}
                    >
                      Switch Active
                    </Label>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-6">
                {[
                  ["inactiveSwitch1", "text-primary", "bg-primary"],
                  ["inactiveSwitch2", "text-purple-600", "bg-purple-600"],
                  ["inactiveSwitch3", "text-green-600", "bg-green-600"],
                  ["inactiveSwitch4", "text-yellow-500", "bg-yellow-500"],
                ].map(([key, textColor, bg]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={key}
                      checked={state[key]}
                      onCheckedChange={() => toggle(key)}
                      className={`!bg-[#9ca3af] !data-[state=checked]:${bg}`}
                    />
                    <Label
                      htmlFor={key}
                      className={state[key] ? `${textColor} font-medium` : ""}
                    >
                      Switch Inactive
                    </Label>
                  </div>
                ))}
              </div>

            </div>
          </DefaultCardComponent>

          {/* ================= SWITCH DISABLE ================= */}
          <DefaultCardComponent title="Switch Disable">
            <div className="flex flex-wrap gap-8">

              <div className="flex flex-wrap gap-6">
                {["switchTwo1", "switchTwo2", "switchTwo3", "switchTwo4"].map(
                  (key) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Switch
                        id={key}
                        checked={state[key]}
                        onCheckedChange={() => toggle(key)}
                        className="!bg-[#9ca3af] !data-[state=checked]:bg-primary"
                      />
                      <Label
                        htmlFor={key}
                        className={state[key] ? "text-primary font-medium" : ""}
                      >
                        Switch Active
                      </Label>
                    </div>
                  )
                )}
              </div>

              <div className="flex flex-wrap gap-6">
                {[
                  "inactiveSwitchTwo1",
                  "inactiveSwitchTwo2",
                  "inactiveSwitchTwo3",
                  "inactiveSwitchTwo4",
                ].map((key) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Switch
                      id={key}
                      checked={state[key]}
                      onCheckedChange={() => toggle(key)}
                      className="!bg-[#9ca3af] !data-[state=checked]:bg-primary"
                    />
                    <Label
                      htmlFor={key}
                      className={state[key] ? "text-primary font-medium" : ""}
                    >
                      Switch Inactive
                    </Label>
                  </div>
                ))}
              </div>

            </div>
          </DefaultCardComponent>

          {/* ================= SWITCH WITH TEXT ================= */}
          <DefaultCardComponent title="Switch With Text">
            <div className="flex gap-6">
              {["switchWithText1", "switchWithText2"].map((key) => (
                <div key={key} className="flex items-center space-x-2">
                  <Switch
                    id={key}
                    checked={state[key]}
                    onCheckedChange={() => toggle(key)}
                    className="!bg-[#9ca3af] !data-[state=checked]:bg-primary"
                  />
                  <Label
                    htmlFor={key}
                    className={state[key] ? "text-primary font-medium" : ""}
                  >
                    {key.endsWith("1") ? "Yes" : "No"}
                  </Label>
                </div>
              ))}
            </div>
          </DefaultCardComponent>

          {/* ================= SWITCH HORIZONTAL ================= */}
          <DefaultCardComponent title="Switch Horizontal">
            <div className="flex flex-wrap gap-6">
              {[
                "inactiveSwitchHorizonta1",
                "inactiveSwitchHorizonta2",
                "inactiveSwitchHorizonta3",
                "inactiveSwitchHorizonta4",
              ].map((key, i) => (
                <div key={key} className="flex items-center space-x-2">
                  <Switch
                    id={key}
                    checked={state[key]}
                    onCheckedChange={() => toggle(key)}
                    className="!bg-[#9ca3af] !data-[state=checked]:bg-primary"
                  />
                  <Label
                    htmlFor={key}
                    className={state[key] ? "text-primary font-medium" : ""}
                  >
                    Horizontal {i + 1}
                  </Label>
                </div>
              ))}
            </div>
          </DefaultCardComponent>

        </div>
      </LazyWrapper>
    </>
  )
}

export default SwitchPage
