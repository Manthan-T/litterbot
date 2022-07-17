// Import various libraries (boilerplate)
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

// This script causes a Litterbot to spawn or be removed.
public class AddOrRemoveLitterbot : MonoBehaviour {
    // This is the Litterbot which will be used to copy from and make more.
    // "public" allows us to input the Litterbot object from Unity.
    public GameObject litterbot;
    // Counts the number of Litterbots present.
    int litterbotCount = 1;

    // The method to spawn more clones.
    public void SpawnLitterbotClone() {
        // Caps the number of Litterbots at 5 (primarily because on the provided map there are only 5 real paths to take (that
        // are long enough)).
        if (litterbotCount != 5) {
            // Create a new Litterbot GameObject.
            GameObject newLitterbot = Instantiate(litterbot);
            // Set its location to a predetermined start point.
            newLitterbot.transform.position = new Vector3(-3.86f, 0.5783749f, -10.87f);
            // Update the number of Litterbots present.
            litterbotCount++;
            // Update the Litterbot's name to match the count.
            newLitterbot.name = "Litterbot " + litterbotCount;
            // Give the Litterbot its route/destinations to reach.
            newLitterbot.GetComponent<LitterbotNavigation>().destinations = ProvideRoute();
        }
    }

    // The method to delete clones.
    public void DeleteLitterbotClone() {
        // Makes sure that there is always at least one Litterbot at any given time.
        if (litterbotCount != 1) {
            // Remove the last spawned Litterbot.
            Destroy(GameObject.Find("Litterbot " + litterbotCount));
            // Update the number of Litterbots present.
            litterbotCount--;
        }
    }

    // The method to provide a route for the Litterbot.
    Vector3[] ProvideRoute() {
        // Prepare an array of points that the Litterbot must pass through on its route.
        Vector3[] route;

        // Depending on the number of the Litterbot, return a set of points that the Litterbot must pass through along its way
        // by adding them to an array of a specified size.
        switch (litterbotCount) {
            case 2:
                route = new Vector3[3];
                route[0] = new Vector3(-8, 0.5783749f, -4.31f);
                route[1] = new Vector3(-3.86f, 0.5783749f, -4.31f);
                route[2] = new Vector3(-3.86f, 0.5783749f, 4.8f);
                return route;
            case 3:
                route = new Vector3[2];
                route[0] = new Vector3(5, 0.5783749f, -4.31f);
                route[1] = new Vector3(5, 0.5783749f, 4.81f);
                return route;
            case 4:
                route = new Vector3[3];
                route[0] = new Vector3(-3.86f, 0.5783749f, -10.18f);
                route[1] = new Vector3(9, 0.5783749f, -10.18f);
                route[2] = new Vector3(9,0.5783749f, -12.6f);
                return route;
            case 5:
                route = new Vector3[2];
                route[0] = new Vector3(9, 0.5783749f, -10.18f);
                route[1] = new Vector3(9, 0.5783749f, 4.81f);
                return route;
            // Just to avoid a compiler error.
            default:
                return null;
        }
    }
}
