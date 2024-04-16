import EventService from "@/services/eventService";
import { useEffect, useState } from "react";
import {
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
} from "../ui/table";

export default function EventList() {

  const [events, setEvents] = useState<EventResponse[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventService = new EventService();
        const eventsData = await eventService.getAllEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Editable</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events &&
            events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.id}</TableCell>
                <TableCell>
                  {event.editable ? "Editable" : "Not Editable"}
                </TableCell>
                <TableCell>{event.name}</TableCell>
                {/* Add additional table cells for other event properties */}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
