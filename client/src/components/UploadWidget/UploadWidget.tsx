import { useEffect, useState } from "react";
import "./UploadWidget.scss";
import { Button, ButtonContent, Icon } from "semantic-ui-react";
import { UploadResult, UploadWidgetConfig } from "../../models/models";

interface UploadWidgetProps {
  uwConfig: UploadWidgetConfig;
  consume: (result: UploadResult) => void;
}

const UploadWidget = ({ ...props }: UploadWidgetProps) => {
  const [loaded, setLoaded] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        (function loadScript() {
          const script = document.createElement("script");
          script.setAttribute("async", "");
          script.setAttribute("id", "uw");
          script.src = "https://upload-widget.cloudinary.com/global/all.js";

          const callBack = () => setLoaded(true);
          script.addEventListener("load", callBack, { once: true });

          script.addEventListener(
            "error",
            () => {
              script.removeEventListener("load", callBack);
              script.remove();
              setTimeout(() => {
                loadScript();
              }, 1000 * 10);
            },
            { once: true }
          );

          document.body.appendChild(script);
        })();
      } else {
        setLoaded(true);
      }
    } else {
      (function initializeWidget() {
        try {
          const myWidget = (window as any).cloudinary.createUploadWidget(
            props.uwConfig,
            (error: any, result: UploadResult) => {
              if (!error && result && result.event === "success") {
                props.consume(result);
              } else if (error) {
                console.log(error);
              }
            }
          );
          document.getElementById("upload")!.addEventListener("click", () => {
            myWidget.open();
          });
          setInitialized(true);
        } catch (error) {
          setTimeout(() => initializeWidget(), 1000 * 5);
        }
      })();
    }
    return () => document.getElementsByTagName("iframe")[0]?.remove();
  }, [loaded]);

  return (
    <Button
      primary
      id="upload"
      animated="fade"
      loading={!initialized}
      disabled={!initialized}
      size="big"
    >
      <ButtonContent hidden>Upload</ButtonContent>
      <ButtonContent visible>
        <Icon name="cloud upload" />
      </ButtonContent>
    </Button>
  );
};

export default UploadWidget;
