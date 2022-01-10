export default function handler(req, res) {
  if (req.method === 'POST' && req?.body.data) {
    // Process a POST request
    res.setHeader(
      'content-disposition',
      `attachment; filename=${req?.body.name}`,
    );
    res.status(200).send({ image: req?.body.data, name: req?.body.name });
  } else {
    // Handle any other HTTP method
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Set desired value here
    },
  },
};
