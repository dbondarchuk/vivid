export const appointmentReminderEmailTemplate = {
  name: "Reminder appointment email",
  value: {
    root: {
      type: "EmailLayout",
      data: {
        backdropColor: "#F5F5F5",
        borderRadius: 0,
        canvasColor: "#FFFFFF",
        textColor: "#262626",
        fontFamily: "BOOK_SANS",
        childrenIds: [
          "block-1740257042821",
          "block-1740257133963",
          "block-1740076839739",
          "block-1740076857419",
          "block-1740258119442",
        ],
      },
    },
    "block-1740076839739": {
      type: "Heading",
      data: {
        props: {
          text: "Reminder about your appointment for {{option.name}} on {{dateTime}}",
        },
        style: {
          textAlign: "center",
          padding: {
            top: 16,
            bottom: 16,
            right: 24,
            left: 24,
          },
        },
      },
    },
    "block-1740076857419": {
      type: "Text",
      data: {
        props: {
          value: [
            {
              children: [
                {
                  text: "Hi {{fields.name}},",
                  fontSize: "14px",
                },
              ],
              type: "p",
              id: "q9weWOHL6n",
            },
            {
              children: [
                {
                  text: "This is a friendly reminder about your upcoming appointment on {{dateTime}}.",
                  fontSize: "14px",
                },
              ],
              type: "p",
              id: "CWH7vJW1Cr",
            },
            {
              type: "p",
              align: "start",
              children: [
                {
                  text: "We are looking forward to seeing you!",
                  fontSize: "14px",
                },
              ],
              id: "J8VSfpARyf",
            },
            {
              type: "p",
              align: "start",
              children: [
                {
                  text: "Best regards,",
                  fontSize: "14px",
                },
              ],
              id: "mm3cqL0LZx",
            },
            {
              type: "p",
              align: "start",
              id: "OdM5ZTAyoj",
              children: [
                {
                  fontSize: "14px",
                  text: "{{config.name}}",
                },
              ],
            },
          ],
        },
        style: {
          padding: {
            top: 16,
            bottom: 16,
            left: 24,
            right: 24,
          },
          fontWeight: "normal",
        },
      },
    },
    "block-1740084827750": {
      type: "ForeachContainer",
      data: {
        props: {
          childrenIds: ["block-1740084850577"],
          value: "addons",
        },
      },
    },
    "block-1740084850577": {
      type: "Heading",
      data: {
        props: {
          text: "{{_item.name}}",
        },
        style: {
          padding: {
            top: 8,
            bottom: 8,
            right: 24,
            left: 24,
          },
        },
      },
    },
    "block-1740084862141": {
      type: "Heading",
      data: {
        props: {
          text: "No addons selected",
        },
        style: {
          padding: {
            top: 16,
            bottom: 16,
            right: 24,
            left: 20,
          },
        },
      },
    },
    "block-1740257042821": {
      type: "Avatar",
      data: {
        style: {
          textAlign: "center",
          padding: {
            top: 16,
            bottom: 16,
            right: 24,
            left: 24,
          },
        },
        props: {
          size: 83,
          shape: "circle",
          imageUrl: "{{config.url}}{{config.logo}}",
        },
      },
    },
    "block-1740257133963": {
      type: "Heading",
      data: {
        props: {
          text: "{{config.name}}",
          level: "h3",
        },
        style: {
          textAlign: "center",
          padding: {
            top: 16,
            bottom: 16,
            right: 24,
            left: 24,
          },
        },
      },
    },
    "block-1740258119442": {
      type: "Text",
      data: {
        props: {
          value: [
            {
              children: [
                {
                  text: "{{config.name}}",
                  fontSize: "11px",
                  color: "#999999",
                },
              ],
              type: "p",
              id: "_ZckO-whgq",
              align: "center",
            },
            {
              type: "p",
              id: "GgAnNok00v",
              align: "center",
              children: [
                {
                  text: "{{config.address}}",
                  fontSize: "11px",
                  color: "#999999",
                },
              ],
            },
            {
              type: "p",
              align: "center",
              children: [
                {
                  text: "{{config.phone}}",
                  fontSize: "11px",
                  color: "#999999",
                },
              ],
              id: "Nb_oLeI107",
            },
          ],
        },
        style: {
          padding: {
            top: 16,
            bottom: 16,
            left: 24,
            right: 24,
          },
          fontWeight: "normal",
        },
      },
    },
  },
};
