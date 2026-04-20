const mongoose = require('mongoose');

const Client = require('../models/Client');
const Department = require('../models/Department');
const Event = require('../models/Event');
const School = require('../models/School');
const Venue = require('../models/Venue');

// Create Event (slug-based)
const createEvent = async (req, res) => {
  const { slug } = req.params;

  try {
    // Resolve slug : client
    const client = await Client.findOne({ slug });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const clientId = client._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const events = Array.isArray(req.body.events)
        ? req.body.events
        : [req.body];

      if (events.length === 0) {
        throw new Error('No events provided');
      }

      // Increment client counter ONCE by number of events
      const updatedClient = await Client.findByIdAndUpdate(
        clientId,
        { $inc: { eventCounter: events.length } },
        { new: true, session }
      );

      if (!updatedClient) throw new Error('Client not found');

      const startingEventNumber =
        updatedClient.eventCounter - events.length + 1;

      const createdEvents = [];

      // Fetch default related entities for this client
      const defaultSchool = await School.findOne({ client: clientId }).session(session); // prettier-ignore
      const defaultDepartment = await Department.findOne({ client: clientId }).session(session); // prettier-ignore
      const defaultVenue = await Venue.findOne({ client: clientId }).session(session); // prettier-ignore
      const defaultSchoolId = defaultSchool?._id;
      const defaultDepartmentId = defaultDepartment?._id;
      const defaultVenueId = defaultVenue?._id;

      for (let i = 0; i < events.length; i++) {
        const {
          event_name = 'Untitled Event',
          school = defaultSchoolId,
          department = defaultDepartmentId,
          venue = defaultVenueId,
          start_at = new Date(),
          end_at = new Date(Date.now() + 60 * 60 * 1000),
          doors_open_before = 30,
          total_tickets = 24,
          published = true,
        } = events[i];

        // Validate school
        const schoolDoc = await School.findOne({
          _id: school,
          client: clientId,
        }).session(session);

        if (!schoolDoc) throw new Error(`Invalid school: ${school}`);

        // Validate department
        const departmentDoc = await Department.findOne({
          _id: department,
          client: clientId,
        }).session(session);

        if (!departmentDoc)
          throw new Error(`Invalid department: ${department}`);

        // Validate venue
        const venueDoc = await Venue.findOne({
          _id: venue,
          client: clientId,
        }).session(session);

        if (!venueDoc) throw new Error(`Invalid venue: ${venue}`);

        createdEvents.push({
          client: clientId,
          event_number: startingEventNumber + i,
          event_name,
          school,
          department,
          venue,
          start_at,
          end_at,
          doors_open_before,
          total_tickets,
          published,
        });
      }

      await Event.insertMany(createdEvents, { session });

      await session.commitTransaction();
      session.endSession();

      res.status(201).json({
        created: createdEvents.length,
        eventNumbers: createdEvents.map((e) => e.event_number),
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      console.error('CREATE EVENT ERROR:', error);
      res.status(400).json({ message: error.message });
    }
  } catch (outerError) {
    console.error('CREATE EVENT OUTER ERROR:', outerError);
    res.status(500).json({ message: outerError.message });
  }
};

// Get Single Event (slug-based)
const getEvent = async (req, res) => {
  try {
    const { slug, eventNumber } = req.params;

    const client = await Client.findOne({ slug });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const event = await Event.findOne({
      client: client._id,
      event_number: Number(eventNumber),
    })
      .populate('school', 'name')
      .populate('department', 'name')
      .populate('venue', 'name')
      .lean();

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({
      ...event,
      eventNumber: event.event_number,
    });
  } catch (error) {
    console.error('GET EVENT ERROR:', error);
    res.status(500).json({ message: 'Failed to fetch event' });
  }
};

// Get All Events (slug-based)
const getEvents = async (req, res) => {
  try {
    const { slug } = req.params;

    const client = await Client.findOne({ slug });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const events = await Event.find({
      client: client._id,
    })
      .sort({ start_at: 1, event_number: -1 })
      .populate('school', 'name')
      .populate('department', 'name')
      .populate('venue', 'name')
      .lean();

    res.json({
      client: {
        name: client.name,
        slug: client.slug,
      },
      events: events.map((e) => ({
        ...e,
        eventNumber: e.event_number,
      })),
    });
  } catch (error) {
    console.error('GET EVENTS ERROR:', error);
    res.status(500).json({ message: 'Failed to fetch events' });
  }
};

// Update Event (slug-based)
const updateEvent = async (req, res) => {
  try {
    const { slug, eventNumber } = req.params;

    const client = await Client.findOne({ slug });
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    const updated = await Event.findOneAndUpdate(
      {
        client: client._id,
        event_number: Number(eventNumber),
      },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({
      message: 'Event updated',
      event: updated,
    });
  } catch (error) {
    console.error('UPDATE EVENT ERROR:', error);
    res.status(500).json({ message: 'Failed to update event' });
  }
};

module.exports = { createEvent, getEvent, getEvents, updateEvent };
