Feature: Measure of distance between two byte vectors
    Two byte vectors should be comparable in the number of bytes in which they differ.
    A measure of zero means equality.
    Additions, changes and removals should be accounted properly.

Scenario: Comparison of two same vectors
    Given a first byte vector "1,2,3"
    And a second byte vector "1,2,3"
    When I measure the distance between the two vectors
    Then the distance should be 0
