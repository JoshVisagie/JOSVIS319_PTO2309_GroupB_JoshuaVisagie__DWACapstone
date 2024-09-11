// react imports
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../reduxHooks";

// redux imports
import { fetchPodcasts } from "../state/podcasts/podcastsSlice";

// mui imports
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { Grid } from "@mui/joy";

// PodInfo component import
import PodInfo from "./PodInfo";

/** 
 * Interface representing a podcast 
 */
interface Podcast {
  id: string; // Unique identifier for the podcast
  title: string; // Title of the podcast
  genres: string[]; // Array of genres the podcast belongs to
  seasons: number; // Number of seasons
  image: string; // URL for the podcast's image
  updated: string; // Date when the podcast was last updated
  description: string; // Description of the podcast
}

/** 
 * Define the props interface for the SinglePod component
 */
interface SinglePodProps {
  podcastTitle: string;           // Title of the podcast
  podcastID: string;              // Unique identifier for the podcast
  podcastGenres: string[];        // Array of genres the podcast belongs to
  podcastSeasons: number;         // Number of seasons in the podcast
  podcastImg: string;             // URL of the podcast image
  podcastDate: string;            // Date when the podcast was last updated
  podcastDescription: string;     // Description of the podcast
  expanded: boolean;              // Whether the accordion is expanded
  handleCollapse: (id: string) => void; // Function to handle accordion expand/collapse
}

/** 
 * SinglePod component represents each individual podcast within the accordion,
 * displaying its summary, title, and expandable details with PodInfo component.
 */
const SinglePod: React.FC<SinglePodProps> = (props) => {
  const date = new Date(props.podcastDate); // Format the podcast's date.

  return (
    <Accordion
      expanded={props.expanded} // Controls whether the accordion is expanded or collapsed.
      onChange={() => props.handleCollapse(props.podcastID)} // Toggle expanded state when clicked.
      square={false}
      sx={{
        borderRadius: "15px",
        margin: "20px", 
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />} 
        aria-controls="panel3-content"
        id="panel3-header"
        className="accordian--singlePod--summary"
      >
        {/* Accordion summary showing the podcast's image, title, and season count */}
        <Grid container 
        className="accordian--singlePod"
        sx={{
            padding: '8px 16px', 
            width:"100%", 
        }}>
          <Grid item>
          <img className="accordian--logo" src={props.podcastImg} height="100px" alt="Podcast Logo" />
          </Grid>
          <Grid xs className="accordian--singlePod--div">
            
              <h3>{props.podcastTitle}</h3> {date.toLocaleDateString()}
           
            <p>
              {props.podcastSeasons}{" "}
              {props.podcastSeasons > 1 ? "Seasons" : "Season"}
            </p>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        {/* Display detailed information of the podcast when expanded */}
        {props.expanded && <PodInfo id={props.podcastID} />}
      </AccordionDetails>
      <AccordionActions>
        {/* Buttons for additional actions, e.g., Cancel and Agree */}
        <Button>Cancel</Button>
        <Button>Agree</Button>
      </AccordionActions>
    </Accordion>
  );
};

/** 
 * PodcastList component fetches and displays a list of podcasts,
 * managing their expanded state to show or hide details.
 */
const PodcastList: React.FC = () => {
  const data = useAppSelector((state) => state.podcasts);
  const dispatch = useAppDispatch();
 
  const [expandedId, setExpandedId] = useState<string | null>(null); // Manage which podcast accordion is expanded.

  // Fetch all podcasts when the component mounts.
  useEffect(() => {
    dispatch(fetchPodcasts());
  }, [dispatch]);

  // Handle expanding/collapsing a specific podcast accordion.
  const handleCollapse = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id)); // Collapse if clicked again, otherwise expand.
  };



  return (
    <div>
      {/* Display loading state if podcasts are still being fetched */}
      {data.isLoading && <p>Loading...</p>}
      
      {/* Render each podcast within an accordion */}
      {data.data.map((podcast: Podcast) => (
        <SinglePod
          key={podcast.id}
          podcastTitle={podcast.title}
          podcastID={podcast.id}
          podcastGenres={podcast.genres}
          podcastSeasons={podcast.seasons}
          podcastImg={podcast.image}
          podcastDate={podcast.updated}
          podcastDescription={podcast.description}
          expanded={expandedId === podcast.id} // Expand the accordion if its ID matches the expanded one.
          handleCollapse={handleCollapse}
        />
      ))}
    </div>
  );
};

export default PodcastList;
