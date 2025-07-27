export const appointmentRescheduledEmailTemplate = {
  name: "Rescheduled appointment email",
  value: {
    type: "EmailLayout",
    id: "block-1740257042800",
    data: {
      backdropColor: "#F5F5F5",
      borderRadius: 0,
      canvasColor: "#FFFFFF",
      textColor: "#262626",
      fontFamily: "BOOK_SANS",
      children: [
        {
          type: "Avatar",
          id: "block-1740257042821",
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
        {
          type: "Heading",
          id: "block-1740257133963",
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
        {
          type: "Heading",
          id: "block-1740076839739",
          data: {
            props: {
              text: "Appointment for {{option.name}} was rescheduled",
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
        {
          type: "Text",
          id: "block-1740076857419",
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
                  type: "p",
                  id: "sV5hCxdKSo",
                  children: [
                    {
                      text: "Thank you for selecting {{config.name}}!",
                      fontSize: "14px",
                    },
                  ],
                },
                {
                  type: "p",
                  align: "start",
                  children: [
                    {
                      text: "Your appointment for {{option.name}} was rescheduled for {{dateTime.full}} and duration: {{#duration.hours}}{{.}} hr {{/duration.hours}}{{#duration.minutes}}{{.}} min{{/duration.minutes}}.",
                      fontSize: "14px",
                    },
                  ],
                  id: "4_g5MvqMhk",
                },
                {
                  children: [
                    {
                      text: "Please give us a call at {{config.phone}} as soon as possible if this time does not work for you.",
                      fontSize: "14px",
                    },
                  ],
                  type: "p",
                  id: "hW8R0FHLpE",
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
                  id: "OHVM-OUpbm",
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
        {
          type: "Text",
          id: "block-1740258119442",
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
      ],
    },
  },
};
