export const appointmentCreatedEmailTemplate = {
  name: "New appointment email",
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
              text: "New appointment request for {{option.name}}",
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
            style: {
              fontWeight: "normal",
              padding: {
                top: 16,
                bottom: 0,
                right: 24,
                left: 24,
              },
            },
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
                      text: "We will confirm your appointment for {{dateTime.full}} shortly",
                      fontSize: "14px",
                    },
                  ],
                  id: "8hoEMcbVdj",
                },
                {
                  type: "p",
                  align: "start",
                  children: [
                    {
                      text: "Service requested: {{option.name}}",
                      fontSize: "14px",
                    },
                  ],
                  id: "4_g5MvqMhk",
                },
              ],
            },
          },
        },
        {
          type: "ConditionalContainer",
          data: {
            props: {
              condition: "addons.length > 0",
              then: {
                children: [
                  {
                    type: "Text",
                    data: {
                      style: {
                        fontWeight: "normal",
                        padding: {
                          top: 0,
                          bottom: 0,
                          right: 24,
                          left: 24,
                        },
                      },
                      props: {
                        value: [
                          {
                            type: "p",
                            align: "start",
                            children: [
                              {
                                text: "Addons selected: {{#addons}}{{name}}, {{/addons}}",
                                fontSize: "14px",
                              },
                            ],
                            id: "8A41CtksKJ",
                          },
                        ],
                      },
                    },
                    id: "block-d5f5129d-9a3e-47d7-9869-e2a7bd6178c7",
                  },
                ],
              },
              otherwise: {
                children: [],
              },
            },
          },
          id: "block-403bf76f-be87-49ad-9452-5e23175a5689",
        },
        {
          type: "Text",
          data: {
            style: {
              fontWeight: "normal",
              padding: {
                top: 0,
                bottom: 16,
                right: 24,
                left: 24,
              },
            },
            props: {
              value: [
                {
                  type: "p",
                  align: "start",
                  children: [
                    {
                      text: "Time: {{dateTime.full}}",
                      fontSize: "14px",
                    },
                  ],
                  id: "-vw3G3y-Pc",
                },
                {
                  type: "p",
                  align: "start",
                  children: [
                    {
                      text: "Duration: {{#duration.hours}}{{.}} hr {{/duration.hours}}{{#duration.minutes}}{{.}} min{{/duration.minutes}}",
                      fontSize: "14px",
                    },
                  ],
                  id: "qLbN6YdVtN",
                },
                {
                  type: "p",
                  align: "start",
                  children: [
                    {
                      text: "Price: ${{totalPriceFormatted}}",
                      fontSize: "14px",
                    },
                  ],
                  id: "BintitQVvl",
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
                  children: [
                    {
                      fontSize: "14px",
                      text: "{{config.name}}",
                    },
                  ],
                  id: "OI4vd4FWaM",
                },
              ],
            },
          },
          id: "block-cf7cd364-4f05-45e2-b7e9-38fd0f3dcd03",
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
