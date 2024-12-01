import { useEffect, useState } from "react";
import "./UploadWidget.scss";
import { Button, ButtonContent, Icon } from "semantic-ui-react";
import { UploadResult, UploadWidgetConfig } from "../../models/models";
import toast from "react-hot-toast";

interface UploadWidgetProps {
  uwConfig: UploadWidgetConfig;
  consume: (result: UploadResult) => void;
}

const UploadWidget = ({ ...props }: UploadWidgetProps) => {
  const [loaded, setLoaded] = useState(false);
  const [initialized, setInitialized] = useState<boolean>();

  useEffect(() => {
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        let counter = 20;
        (function loadScript() {
          const script = document.createElement("script");
          script.setAttribute("async", "");
          script.setAttribute("id", "uw");
          script.src = "https://upload-widget.cloudinary.com/global/all.js";

          function loadListener() {
            script.removeEventListener("error", errorListener);
            setLoaded(true);
          }
          function errorListener() {
            if (counter === 0) {
              setInitialized(false);
              toast.error("Failed to load cloudinary resources!");
              return;
            }
            script.removeEventListener("load", loadListener);
            script.remove();
            counter -= 1;
            setTimeout(() => loadScript(), 1000 * 10);
          }

          script.addEventListener("load", loadListener, { once: true });
          script.addEventListener("error", errorListener, { once: true });

          document.body.appendChild(script);
        })();
      } else {
        setLoaded(true);
      }
    } else {
      let counter = 10;
      (function initializeWidget() {
        try {
          const myWidget = (window as any).cloudinary.createUploadWidget(
            props.uwConfig,
            (error: any, result: UploadResult) => {
              if (!error && result && result.event === "success") {
                props.consume(result);
              } else if (error) {
                toast.success("Something went wrong!");
              }
            }
          );
          document.getElementById("upload")!.addEventListener("click", () => {
            myWidget.open();
          });
          setInitialized(true);
        } catch (error) {
          if (counter === 0) {
            setInitialized(false);
            toast.error("Failed to initialize the upload widget!");
            return;
          }
          counter -= 1;
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
      loading={initialized === undefined}
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
